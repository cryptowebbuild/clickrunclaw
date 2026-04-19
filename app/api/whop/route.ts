import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Lazy initialization of Supabase admin client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables for Webhook.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body = await req.json();

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
