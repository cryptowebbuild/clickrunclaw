import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // 1. Signature Verification (Security Fix)
    const signature = req.headers.get('x-whop-signature');
    const secret = process.env.WHOP_WEBHOOK_SECRET;
    let body;

    if (!secret) {
      console.warn("WHOP_WEBHOOK_SECRET is not set. Webhook verification skipped (DANGEROUS).");
      body = await req.json();
    } else {
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      const bodyText = await req.text();
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw', 
        keyData, 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['verify']
      );

      const isValid = await crypto.subtle.verify(
        'HMAC',
        cryptoKey,
        hexToBuffer(signature),
        encoder.encode(bodyText)
      );

      if (!isValid) {
        console.error("Invalid Whop signature detected.");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }

      try {
        body = JSON.parse(bodyText);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
      }
    }

    // 2. Database Initialization
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables for Webhook.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 3. Process Whop Event
    if (body.action === 'payment_succeeded' || body.action === 'membership_activated') {
      const email = body.data?.user?.email || body.data?.email || body.email;
      
      const payloadString = JSON.stringify(body).toLowerCase();
      const assignedTier = payloadString.includes('pro') ? 'pro' : 'starter';

      if (email) {
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

    return NextResponse.json({ success: true, message: "Webhook received but not processed" });
  } catch (error) {
    console.error("Whop Webhook Error:", error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// Helper to convert hex signature to buffer
function hexToBuffer(hex: string) {
  const binary = new Uint8Array(hex.length / 2);
  for (let i = 0; i < binary.length; i++) {
    binary[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return binary;
}
