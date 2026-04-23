import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const ACTIVE_MEMBERSHIP_STATUSES = new Set(['trialing', 'active', 'completed']);
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
    const { email, custom_user_id: customUserId } = await req.json();

    if (!email && !customUserId) {
      return NextResponse.json({ error: 'email or custom_user_id required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing Supabase configuration' }, { status: 500 });
    }

    const whopApiKey = process.env.CLICKRUNCLAW_WHOP_API_KEY || process.env.WHOP_API_KEY;
    if (!whopApiKey) {
      return NextResponse.json({ error: 'Missing Whop API key' }, { status: 500 });
    }

    const response = await fetch('https://api.whop.com/api/v1/memberships?company_id=biz_860wM852Q3ACNi', {
      headers: {
        Authorization: `Bearer ${whopApiKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Whop API error: ${response.status}` }, { status: 502 });
    }

    const payload = await response.json();
    const memberships = Array.isArray(payload?.data) ? payload.data : [];
    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;

    const matchingMemberships = memberships
      .filter((item: any) => ACTIVE_MEMBERSHIP_STATUSES.has(String(item?.status || '').toLowerCase()))
      .filter((item: any) => !normalizedEmail || String(item?.user?.email || '').trim().toLowerCase() === normalizedEmail)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const latestMembership = matchingMemberships[0];

    if (!latestMembership) {
      const recentEmails = memberships
        .filter((item: any) => ACTIVE_MEMBERSHIP_STATUSES.has(String(item?.status || '').toLowerCase()))
        .slice(-5)
        .map((item: any) => item?.user?.email)
        .filter(Boolean);

      return NextResponse.json({
        synced: false,
        reason: 'no_active_membership',
        email: normalizedEmail,
        hint: recentEmails.length ? `Recent Whop emails: ${Array.from(new Set(recentEmails)).join(', ')}` : null,
      });
    }

    const planTier = resolvePlanTier(latestMembership);
    if (!planTier) {
      return NextResponse.json({ synced: false, reason: 'unsupported_plan' });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let query = supabaseAdmin.from('profiles').update({ plan_tier: planTier });
    query = customUserId ? query.eq('id', customUserId) : query.eq('email', email);

    const { data, error } = await query.select('id,email,plan_tier').single();
    if (error) {
      return NextResponse.json({ synced: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      synced: true,
      plan_tier: planTier,
      membership_id: latestMembership.id,
      membership_status: latestMembership.status,
      profile: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Sync failed' }, { status: 500 });
  }
}

function resolvePlanTier(item: any): 'starter' | 'pro' | null {
  const productId = item?.product?.id;
  const planId = item?.plan?.id;
  const productTitle = String(item?.product?.title || '').toLowerCase();
  const planTitle = String(item?.plan?.title || '').toLowerCase();

  if (productId && PLAN_TIER_BY_PRODUCT_ID[productId]) return PLAN_TIER_BY_PRODUCT_ID[productId];
  if (planId && PLAN_TIER_BY_PLAN_ID[planId]) return PLAN_TIER_BY_PLAN_ID[planId];

  const haystack = `${productTitle} ${planTitle}`;
  if (haystack.includes('pro')) return 'pro';
  if (haystack.includes('starter')) return 'starter';
  return null;
}
