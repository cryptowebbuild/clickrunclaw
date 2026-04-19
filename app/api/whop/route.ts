export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('Missing WHOP_WEBHOOK_SECRET environment variable.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Lazy initialization of Supabase admin client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables for Webhook.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get the headers for Svix verification
    const svix_id = req.headers.get("svix-id");
    const svix_timestamp = req.headers.get("svix-timestamp");
    const svix_signature = req.headers.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    // Get the raw body string
    const payload = await req.text();

    // Create a new Svix Webhook instance
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the webhook payload and headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err: any) {
      console.error("Webhook Verification Failed:", err.message);
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 401 });
    }

    const body = evt;

    // Verify it's a Whop webhook event (Subscription Active / Payment Success)
    if (body.action === 'payment_succeeded' || body.action === 'membership_activated') {
      // Whop payload structures can vary safely extract the email
      const email = body.data?.user?.email || body.data?.email || body.email;
      
      // Attempt to identify if they bought the Pro pack by looking for 'pro' in the payload details
      const payloadString = payload.toLowerCase();
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
