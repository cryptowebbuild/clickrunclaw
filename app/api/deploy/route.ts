import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to deploy agents.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_tier')
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
    const coolifyUrl = process.env.CLICKRUNCLAW_COOLIFY_URL;
    const coolifyToken = process.env.CLICKRUNCLAW_COOLIFY_TOKEN;
    const coolifyServiceUuid = process.env.CLICKRUNCLAW_COOLIFY_RESOURCE_UUID;

    if (!coolifyWebhook && !(coolifyUrl && coolifyToken && coolifyServiceUuid)) {
      return NextResponse.json({
        error: 'Deployment is not configured yet. Missing Coolify webhook or API configuration.'
      }, { status: 500 });
    }

    const { data: dbAgent, error: dbError } = await supabase
      .from('agents')
      .insert([
        {
          user_id: user.id,
          name: normalizedName,
          provider: normalizedProvider,
          api_key_secure: normalizedApiKey,
          telegram_bot_token: normalizedTelegramToken,
          telegram_status: normalizedTelegramToken ? 'pending' : 'none',
          status: 'deploying'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to initialize agent in database.' }, { status: 500 });
    }

    let deploymentQueued = false;
    let deploymentWarning: string | null = null;
    let infrastructureRef: string | null = null;

    if (coolifyUrl && coolifyToken && coolifyServiceUuid) {
      try {
        const res = await fetch(`${coolifyUrl.replace(/\/$/, '')}/api/v1/services/${coolifyServiceUuid}/start`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${coolifyToken}`,
            Accept: 'application/json',
          },
          cache: 'no-store',
        });

        const raw = await res.text();
        let parsed: any = null;
        try {
          parsed = raw ? JSON.parse(raw) : null;
        } catch {
          parsed = null;
        }

        if (!res.ok) {
          deploymentWarning = parsed?.message || `Coolify API responded with status ${res.status}.`;
        } else {
          deploymentQueued = true;
          infrastructureRef = coolifyServiceUuid;
          deploymentWarning = parsed?.message || null;
        }
      } catch (err) {
        deploymentWarning = 'Coolify API could not be reached.';
        console.error('Could not trigger Coolify service start.', err);
      }
    } else if (coolifyWebhook) {
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
    }

    const userHookUrl = `https://hook.clickrunclaw.com/a/${dbAgent.id.split('-')[0]}`;
    const nextStatus = deploymentQueued ? 'deploying' : 'failed';

    const { error: updateError } = await supabase
      .from('agents')
      .update({
        status: nextStatus,
        webhook_url: userHookUrl,
        container_id: infrastructureRef,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbAgent.id);

    if (updateError) {
      console.error('Update Error:', updateError);
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
          containerId: infrastructureRef,
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
        containerId: infrastructureRef,
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
