import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createCoolifyService } from '@/lib/coolify';

export const runtime = 'edge';

function slugifyAgentName(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'agent';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    let { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (token) {
        const cookieStore = await cookies();
        const tokenSupabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return cookieStore.getAll();
              },
              setAll() {},
            },
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );

        const authResult = await tokenSupabase.auth.getUser(token);
        user = authResult.data.user;
        authError = authResult.error;
      }
    }

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

    const { data: existingAgents, error: agentsError } = await supabase
      .from('agents')
      .select('id, status, name, provider, api_key_secure, telegram_bot_token')
      .eq('user_id', user.id);

    if (agentsError) {
      return NextResponse.json({ error: 'Could not inspect existing agents.' }, { status: 500 });
    }

    const agents = existingAgents || [];
    const activeStatuses = new Set(['deploying', 'queued', 'running', 'starting', 'active']);
    const currentAgentCount = agents.filter(agent => activeStatuses.has(String(agent.status || '').toLowerCase())).length;

    if (planTier === 'starter' && currentAgentCount >= 1) {
      return NextResponse.json({
        error: 'PAYWALL',
        message: 'Starter plan limit reached (1/1 active agents). Upgrade to Pro for up to 5 included agents with 2 active at a time.'
      }, { status: 403 });
    }

    if (planTier === 'pro' && currentAgentCount >= 2) {
      return NextResponse.json({
        error: 'PAYWALL_MAX',
        message: 'Pro plan limit reached (2/2 active agents). Pro includes up to 5 agents total, with 2 active at a time on the current infrastructure.'
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

    const retryTarget = agents.find(agent =>
      String(agent.status || '').toLowerCase() === 'failed' &&
      String(agent.name || '').trim().toLowerCase() === normalizedName.toLowerCase() &&
      String(agent.provider || '').trim().toLowerCase() === normalizedProvider
    );

    if (!normalizedName || !normalizedProvider || !normalizedApiKey) {
      return NextResponse.json({ error: 'Invalid deployment configuration.' }, { status: 400 });
    }

    const coolifyUrl = process.env.CLICKRUNCLAW_COOLIFY_URL;
    const coolifyToken = process.env.CLICKRUNCLAW_COOLIFY_TOKEN;
    const coolifyProjectUuid = process.env.CLICKRUNCLAW_COOLIFY_PROJECT_ID;
    const coolifyEnvironmentUuid = process.env.CLICKRUNCLAW_COOLIFY_ENVIRONMENT_ID;
    const coolifyServerUuid = process.env.CLICKRUNCLAW_COOLIFY_SERVER_UUID || 'pst7oglnpvrso8c4pqm5he8h';
    const coolifyBaseDomain = process.env.CLICKRUNCLAW_AGENT_BASE_DOMAIN;

    if (!(coolifyUrl && coolifyToken && coolifyProjectUuid && coolifyEnvironmentUuid && coolifyServerUuid)) {
      return NextResponse.json({
        error: 'Deployment is not configured yet. Missing Coolify API configuration.'
      }, { status: 500 });
    }

    let dbAgent: any = null;

    if (retryTarget) {
      const { data: updatedAgent, error: retryError } = await supabase
        .from('agents')
        .update({
          api_key_secure: normalizedApiKey,
          telegram_bot_token: normalizedTelegramToken,
          telegram_status: normalizedTelegramToken ? 'pending' : 'none',
          status: 'deploying',
          updated_at: new Date().toISOString(),
        })
        .eq('id', retryTarget.id)
        .select()
        .single();

      if (retryError || !updatedAgent) {
        console.error('Retry Update Error:', retryError);
        return NextResponse.json({ error: 'Failed to requeue existing failed agent.' }, { status: 500 });
      }

      dbAgent = updatedAgent;
    } else {
      const { data: insertedAgent, error: dbError } = await supabase
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

      if (dbError || !insertedAgent) {
        console.error('Database Error:', dbError);
        return NextResponse.json({ error: 'Failed to initialize agent in database.' }, { status: 500 });
      }

      dbAgent = insertedAgent;
    }

    let deploymentQueued = false;
    let deploymentWarning: string | null = null;
    let infrastructureRef: string | null = null;
    let serviceDomain: string | null = null;

    try {
      const serviceName = `crc-${slugifyAgentName(normalizedName)}-${dbAgent.id.split('-')[0]}`;
      serviceDomain = coolifyBaseDomain ? `${serviceName}.${coolifyBaseDomain}` : null;

      const created = await createCoolifyService({
        name: serviceName,
        projectUuid: coolifyProjectUuid,
        environmentUuid: coolifyEnvironmentUuid,
        serverUuid: coolifyServerUuid,
        domain: serviceDomain,
        env: {
          OPENCLAW_AGENT_NAME: normalizedName,
          OPENCLAW_LLM_PROVIDER: normalizedProvider,
        },
      });

      infrastructureRef = created?.uuid || null;
      deploymentQueued = Boolean(infrastructureRef);
      if (!deploymentQueued) {
        deploymentWarning = 'Coolify service was created without a returned UUID.';
      }
    } catch (err: any) {
      deploymentWarning = err?.message || 'Coolify service provisioning failed.';
      console.error('Could not create Coolify service.', err);
    }

    const userHookUrl = serviceDomain ? `https://${serviceDomain}` : `https://hook.clickrunclaw.com/a/${dbAgent.id.split('-')[0]}`;
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
