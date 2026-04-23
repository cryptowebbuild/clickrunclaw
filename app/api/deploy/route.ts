import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createLocalAgent, upsertLocalUser } from '@/lib/db/agents';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to deploy agents.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_tier, full_name, email')
      .eq('id', user.id)
      .single();

    const planTier = profile?.plan_tier?.toLowerCase() || 'free';

    if (planTier === 'free') {
      return NextResponse.json({
        error: 'PAYWALL',
        message: 'You are on the Free Tier. Please upgrade your plan to deploy OpenClaw Agents.'
      }, { status: 403 });
    }

    const { count } = await supabase
      .from('agents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const currentAgentCount = count || 0;

    if (planTier === 'starter' && currentAgentCount >= 1) {
      return NextResponse.json({
        error: 'PAYWALL',
        message: 'Starter plan limit reached (1/1 Agents). Please upgrade to Pro to deploy up to 5 agents.'
      }, { status: 403 });
    }

    if (planTier === 'pro' && currentAgentCount >= 5) {
      return NextResponse.json({
        error: 'PAYWALL_MAX',
        message: 'Pro plan limit reached (5/5 Agents). Contact support for Enterprise.'
      }, { status: 403 });
    }

    const { agentName, provider, apiKey, telegramToken } = await req.json();

    if (!agentName || !provider || !apiKey) {
      return NextResponse.json({ error: 'Missing required configuration: agentName, provider, or apiKey.' }, { status: 400 });
    }

    const normalizedName = String(agentName).trim();
    const normalizedProvider = String(provider).trim().toLowerCase();
    const normalizedApiKey = String(apiKey).trim();
    const normalizedTelegramToken = telegramToken ? String(telegramToken).trim() : null;

    if (!normalizedName || !normalizedProvider || !normalizedApiKey) {
      return NextResponse.json({ error: 'Invalid deployment configuration.' }, { status: 400 });
    }

    const coolifyWebhook = process.env.COOLIFY_DEPLOY_WEBHOOK_URL;
    if (!coolifyWebhook) {
      return NextResponse.json({ error: 'Deployment is not configured yet. COOLIFY_DEPLOY_WEBHOOK_URL is missing.' }, { status: 500 });
    }

    upsertLocalUser({
      id: user.id,
      email: profile?.email || user.email,
      fullName: profile?.full_name || user.user_metadata?.full_name || null,
      planTier,
    });

    const dbAgent = createLocalAgent({
      userId: user.id,
      name: normalizedName,
      provider: normalizedProvider,
      planSnapshot: planTier,
      telegramStatus: normalizedTelegramToken ? 'pending' : 'none',
      deploymentStatusDetail: 'Deployment requested from dashboard',
      apiKey: normalizedApiKey,
      telegramBotToken: normalizedTelegramToken,
    });

    let deploymentQueued = false;
    let deploymentWarning: string | null = null;

    try {
      const res = await fetch(coolifyWebhook, { method: 'POST' });
      if (!res.ok) {
        deploymentWarning = `Deployment hook responded with status ${res.status}.`;
      } else {
        deploymentQueued = true;
      }
    } catch (err) {
      deploymentWarning = 'Deployment hook could not be reached.';
      console.error('Could not trigger Coolify webhook.', err);
    }

    const userHookUrl = dbAgent.webhook_url;
    const nextStatus = deploymentQueued ? 'deploying' : 'failed';

    const mirrorPayload = {
      id: dbAgent.id,
      user_id: user.id,
      name: normalizedName,
      provider: normalizedProvider,
      api_key_secure: normalizedApiKey,
      telegram_bot_token: normalizedTelegramToken,
      telegram_status: normalizedTelegramToken ? 'pending' : 'none',
      status: nextStatus,
      webhook_url: userHookUrl,
      container_id: null,
      updated_at: new Date().toISOString(),
    };

    const mirrorResult = await supabase.from('agents').insert([mirrorPayload]);
    if (mirrorResult.error) {
      console.error('Supabase mirror insert failed:', mirrorResult.error);
    }

    if (!deploymentQueued) {
      return NextResponse.json({
        error: 'DEPLOYMENT_QUEUE_FAILED',
        message: deploymentWarning || 'Deployment could not be queued.',
        agent: {
          id: dbAgent.id,
          name: normalizedName,
          status: 'failed',
          webhookUrl: userHookUrl,
          containerId: null,
        }
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      queued: true,
      message: 'Deployment request accepted and queued for provisioning.',
      agent: {
        id: dbAgent.id,
        name: normalizedName,
        status: 'deploying',
        webhookUrl: userHookUrl,
        containerId: null,
      },
      warning: deploymentWarning,
    });
  } catch (error: any) {
    console.error('Deployment Logic Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred building the container.' },
      { status: 500 }
    );
  }
}
