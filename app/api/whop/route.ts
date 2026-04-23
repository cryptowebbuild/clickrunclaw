import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const SUPPORTED_EVENTS = new Set([
  'payment_succeeded',
  'payment.succeeded',
  'membership_activated',
  'membership.activated',
  'membership.went_valid',
  'membership.updated',
]);

const ACTIVE_MEMBERSHIP_STATUSES = new Set(['trialing', 'active']);

const PLAN_TIER_BY_PRODUCT_ID: Record<string, 'starter' | 'pro'> = {
  prod_3ucOWlOWqqBTK: 'starter',
  prod_6hVRfVLQZt6cY: 'pro',
};

const PLAN_TIER_BY_PLAN_ID: Record<string, 'starter' | 'pro'> = {
  plan_T8nSbRxGGTlly: 'starter',
  plan_Bhg70HYNZqmJV: 'pro',
};

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

    const whopApiKey = process.env.CLICKRUNCLAW_WHOP_API_KEY || process.env.WHOP_API_KEY || null;

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

    const membershipStatus = String(
      body.data?.membership?.status ||
      body.data?.status ||
      ''
    ).trim().toLowerCase();

    if (eventType.startsWith('membership') && membershipStatus && !ACTIVE_MEMBERSHIP_STATUSES.has(membershipStatus)) {
      return NextResponse.json({
        success: true,
        message: `Membership ignored due to status: ${membershipStatus}`,
        eventType,
      });
    }

    const assignedTier = resolvePlanTier(body);

    if (!assignedTier) {
      return NextResponse.json({
        success: true,
        message: 'Webhook ignored: unsupported product or plan',
        eventType,
      });
    }

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

    if ((!updatedRows || updatedRows.length === 0) && whopApiKey && email) {
      const synced = await syncProfileFromWhop({
        supabaseAdmin,
        whopApiKey,
        email,
        customUserId,
      });

      if (synced) {
        updatedRows = [synced];
      }
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

function resolvePlanTier(body: any): 'starter' | 'pro' | null {
  const productId = body.data?.product?.id;
  const planId = body.data?.plan?.id;
  const productTitle = String(body.data?.product?.title || '').toLowerCase();
  const planTitle = String(body.data?.plan?.title || '').toLowerCase();

  if (productId && PLAN_TIER_BY_PRODUCT_ID[productId]) {
    return PLAN_TIER_BY_PRODUCT_ID[productId];
  }

  if (planId && PLAN_TIER_BY_PLAN_ID[planId]) {
    return PLAN_TIER_BY_PLAN_ID[planId];
  }

  const haystack = `${productTitle} ${planTitle}`;
  if (haystack.includes('pro')) return 'pro';
  if (haystack.includes('starter')) return 'starter';

  return null;
}

async function syncProfileFromWhop({
  supabaseAdmin,
  whopApiKey,
  email,
  customUserId,
}: {
  supabaseAdmin: any;
  whopApiKey: string;
  email: string;
  customUserId: string | null;
}) {
  try {
    const response = await fetch(`https://api.whop.com/api/v1/memberships?company_id=biz_860wM852Q3ACNi`, {
      headers: {
        Authorization: `Bearer ${whopApiKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Whop membership sync failed.', response.status);
      return null;
    }

    const payload = await response.json();
    const memberships = Array.isArray(payload?.data) ? payload.data : [];

    const latestMembership = memberships
      .filter((item: any) => item?.user?.email === email)
      .filter((item: any) => ACTIVE_MEMBERSHIP_STATUSES.has(String(item?.status || '').toLowerCase()))
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (!latestMembership) {
      return null;
    }

    const syncedTier = resolvePlanTier({ data: latestMembership });
    if (!syncedTier) {
      return null;
    }

    let query = supabaseAdmin.from('profiles').update({ plan_tier: syncedTier });
    query = customUserId ? query.eq('id', customUserId) : query.eq('email', email);

    const { data, error } = await query.select('id,email,plan_tier');
    if (error || !data?.length) {
      if (error) console.error('Fallback Whop sync update failed.', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Fallback Whop sync error:', error);
    return null;
  }
}

function hexToBuffer(hex: string) {
  const binary = new Uint8Array(hex.length / 2);
  for (let i = 0; i < binary.length; i++) {
    binary[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return binary;
}
