import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const SUPPORTED_EVENTS = new Set([
  'payment_succeeded',
  'payment.succeeded',
  'membership_activated',
  'membership.activated',
  'membership.went_valid',
]);

export async function POST(req: Request) {
  try {
    const secret = process.env.WHOP_WEBHOOK_SECRET;
    const bodyText = await req.text();
    const body = parseJson(bodyText);

    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const signature =
      req.headers.get('x-whop-signature') ||
      req.headers.get('whop-signature') ||
      req.headers.get('x-signature');

    if (secret) {
      if (!signature) {
        console.warn('Whop webhook missing signature header.');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      const isValid = await verifySignature(signature, secret, bodyText);
      if (!isValid) {
        console.error('Invalid Whop signature detected.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    } else {
      console.warn('WHOP_WEBHOOK_SECRET is not set. Webhook verification skipped (DANGEROUS).');
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables for Webhook.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const eventType = String(body.type || body.action || '').trim();
    if (!SUPPORTED_EVENTS.has(eventType)) {
      return NextResponse.json({ success: true, message: `Webhook ignored: ${eventType || 'unknown_event'}` });
    }

    const email =
      body.data?.user?.email ||
      body.data?.email ||
      body.email ||
      null;

    const customUserId =
      body.data?.custom_user_id ||
      body.data?.metadata?.custom_user_id ||
      body.custom_user_id ||
      body.metadata?.custom_user_id ||
      null;

    const assignedTier = resolvePlanTier(body);

    if (!email && !customUserId) {
      console.error('Whop webhook missing both email and custom_user_id.');
      return NextResponse.json({ error: 'Missing user identifier' }, { status: 400 });
    }

    let query = supabaseAdmin.from('profiles').update({ plan_tier: assignedTier });
    if (customUserId) {
      query = query.eq('id', customUserId);
    } else {
      query = query.eq('email', email);
    }

    const { data: updatedRows, error } = await query.select('id,email,plan_tier');

    if (error) {
      console.error('Error updating user plan:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    if (!updatedRows || updatedRows.length === 0) {
      console.error('No matching profile found for Whop webhook.', {
        email,
        customUserId,
        eventType,
      });
      return NextResponse.json({ error: 'No matching profile found' }, { status: 404 });
    }

    console.log(`Successfully upgraded user to ${assignedTier} tier via Whop.`, {
      eventType,
      email,
      customUserId,
    });

    return NextResponse.json({
      success: true,
      message: `User upgraded to ${assignedTier}`,
      eventType,
      matchedBy: customUserId ? 'id' : 'email',
    });
  } catch (error) {
    console.error('Whop Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

function parseJson(bodyText: string) {
  try {
    return JSON.parse(bodyText);
  } catch {
    return null;
  }
}

async function verifySignature(signature: string, secret: string, bodyText: string) {
  const normalizedSignature = signature.trim().replace(/^sha256=/i, '');
  if (!/^[a-f0-9]+$/i.test(normalizedSignature) || normalizedSignature.length % 2 !== 0) {
    return false;
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  return crypto.subtle.verify(
    'HMAC',
    cryptoKey,
    hexToBuffer(normalizedSignature),
    encoder.encode(bodyText)
  );
}

function resolvePlanTier(body: any) {
  const haystack = JSON.stringify({
    plan: body.data?.plan,
    product: body.data?.product,
    membership: body.data?.membership,
    data: body.data,
  }).toLowerCase();

  if (haystack.includes('pro')) return 'pro';
  return 'starter';
}

function hexToBuffer(hex: string) {
  const binary = new Uint8Array(hex.length / 2);
  for (let i = 0; i < binary.length; i++) {
    binary[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return binary;
}
