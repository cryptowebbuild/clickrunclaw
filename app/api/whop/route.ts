export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Convert a hex string to an ArrayBuffer
function hexToArrayBuffer(hex: string) {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const view = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return view.buffer;
}

// Base64 decode to Uint8Array (since Edge runtime doesn't have Buffer, and atob works for base64 strings)
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Missing WHOP_WEBHOOK_SECRET environment variable.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const svixId = req.headers.get('x-svix-id');
    const svixTimestamp = req.headers.get('x-svix-timestamp');
    const svixSignatureHeader = req.headers.get('x-svix-signature');

    if (!svixId || !svixTimestamp || !svixSignatureHeader) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // svix signature header is usually formatted as "v1,signature_base64 v1,signature_base64..."
    const signatures = svixSignatureHeader.split(' ').map(s => s.split(',')[1]).filter(Boolean);
    if (signatures.length === 0) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const rawBody = await req.text();
    const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;

    const encoder = new TextEncoder();

    // Process webhook secret (usually starts with "whsec_")
    let secretBytes;
    if (webhookSecret.startsWith('whsec_')) {
      secretBytes = base64ToUint8Array(webhookSecret.split('_')[1]);
    } else {
      secretBytes = encoder.encode(webhookSecret);
    }

    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const dataBuffer = encoder.encode(signedContent);

    let isValid = false;
    for (const signatureBase64 of signatures) {
      try {
        const signatureBytes = base64ToUint8Array(signatureBase64);
        const verified = await crypto.subtle.verify(
          'HMAC',
          key,
          signatureBytes,
          dataBuffer
        );
        if (verified) {
          isValid = true;
          break;
        }
      } catch (err) {
        // Continue checking other signatures if verification throws
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Lazy initialization of Supabase admin client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables for Webhook.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify it's a Whop webhook event (Subscription Active / Payment Success)
    if (body.action === 'payment_succeeded' || body.action === 'membership_activated') {
      // Whop payload structures can vary safely extract the email
      const email = body.data?.user?.email || body.data?.email || body.email;
      
      // Attempt to identify if they bought the Pro pack by looking for 'pro' in the payload details
      const payloadString = JSON.stringify(body).toLowerCase();
      const assignedTier = payloadString.includes('pro') ? 'pro' : 'starter';

      // Update the user's profile to their new tier based on their email
      if (email) {
        // 1. Find the user ID from the email (requires checking auth users or profiles)
        // Since we are using Supabase, we can update the profile where email matches,
        // or we expect the user to have added their email to the profile table.
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ plan_tier: assignedTier })
          .eq('email', email);

        if (error) {
          console.error("Error updating user plan:", error);
          return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }

        console.log(`Successfully upgraded user ${email} to ${assignedTier} tier via Whop.`);
        return NextResponse.json({ success: true, message: `User upgraded to ${assignedTier}` });
      }
    }

    // Default response for other webhook events
    return NextResponse.json({ success: true, message: "Webhook received but not processed" });
  } catch (error) {
    console.error("Whop Webhook Error:", error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
