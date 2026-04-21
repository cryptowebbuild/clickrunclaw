import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Init Supabase Admin (সার্ভার সাইডে ডাটাবেস এক্সেস করার জন্য Service Role Key প্রয়োজন)
    // এটি ইউজারের লগিন ছাড়াই ব্যাকগ্রাউন্ডে ডাটাবেস আপডেট করতে পারে
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const payload = await req.json();
    
    // **সিকিউরিটি চেক**: এটি কি আসলেই Whop থেকে এসেছে কিনা তা চেক করা (HMAC Verification)
    // (প্রোডাকশনে যাওয়ার আগে এখানে Whop Signature ভেরিফাই করতে হবে)

    // পেমেন্ট সফল হলে Whop 'membership.went_valid' বা 'payment.succeeded' ইভেন্ট পাঠায়
    if (payload.action === 'membership.went_valid') {
      
      // চেকআউট லிংক থেকে কাস্টম ইউজার আইডি বের করা
      const userId = payload.data.custom_fields?.user_id || payload.data.custom_user_id || payload.data.user?.id;

      if (userId) {
         // ডাটাবেসে ইউজারের সাবস্ক্রিপশন প্ল্যান আপডেট করা
         const { error } = await supabaseAdmin
           .from('profiles')
           .update({ 
             plan_tier: 'pro', 
             credits: 50, // বা Whop এর প্ল্যান অনুযায়ী ক্রেডিট অ্যাড করা
             updated_at: new Date().toISOString() 
           })
           .eq('id', userId);
           
         if(error) {
             console.error('Database Update Failed:', error);
             return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
         }

         console.log('✅ User Payment Confirmed & Upgraded:', userId);
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
