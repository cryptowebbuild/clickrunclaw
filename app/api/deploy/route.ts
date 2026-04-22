import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // 1. Authenticate the User Securely
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to deploy agents.' }, { status: 401 });
    }

    // --- PAYWALL LOGIC: Check User Subscription Tier ---
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

    // --- AGENT LIMIT LOGIC ---
    // Count how many agents the user currently has
    const { count, error: countError } = await supabase
      .from('agents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const currentAgentCount = count || 0;

    // Enforce Starter Limit (1 Agent)
    if (planTier === 'starter' && currentAgentCount >= 1) {
      return NextResponse.json({ 
        error: 'PAYWALL', 
        message: 'Starter plan limit reached (1/1 Agents). Please upgrade to Pro to deploy up to 5 agents.' 
      }, { status: 403 });
    }

    // Enforce Pro Limit (5 Agents)
    if (planTier === 'pro' && currentAgentCount >= 5) {
      return NextResponse.json({ 
        error: 'PAYWALL_MAX', 
        message: 'Pro plan limit reached (5/5 Agents). Contact support for Enterprise.' 
      }, { status: 403 });
    }

    // 2. Parse the Request Data
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

    // 3. Insert Agent into Supabase Database 
    // Initial status: 'deploying'
    const { data: dbAgent, error: dbError } = await supabase
      .from('agents')
      .insert([
        {
          user_id: user.id,
          name: normalizedName,
          provider: normalizedProvider,
          api_key_secure: normalizedApiKey, // Securely stored in RLS protected table
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

    // -------------------------------------------------------------
    // 4. Trigger Coolify deployment
    // -------------------------------------------------------------
    let deploymentSuccess = true;
    
    try {
      const res = await fetch(coolifyWebhook, { method: 'POST' });
      if (!res.ok) {
         deploymentSuccess = false;
         throw new Error(`Coolify webhook failed with status ${res.status}`);
      }
      console.log('Coolify deployment triggered successfully.');
    } catch (err) {
      deploymentSuccess = false;
      console.error('Could not trigger Coolify webhook.', err);
    }
    
    if (!deploymentSuccess) {
       await supabase.from('agents').update({ status: 'failed' }).eq('id', dbAgent.id);
       return NextResponse.json({ error: 'Failed to deploy container to cloud infrastructure.' }, { status: 500 });
    }

    // Generate a secure, unique Webhook URL that users can use for their bot
    const userHookUrl = `https://hook.clickrunclaw.com/a/${dbAgent.id.split('-')[0]}`;
    const containerIdTag = `openclaw-${dbAgent.id.split('-')[0]}`;

    // 5. Update Status to 'running' and save the Webhook URL
    const { error: updateError } = await supabase
      .from('agents')
      .update({ 
        status: 'running', 
        webhook_url: userHookUrl,
        container_id: containerIdTag
      })
      .eq('id', dbAgent.id);

    if (updateError) {
      console.error('Update Error:', updateError);
    }

    // 6. Return Success Response
    return NextResponse.json({ 
      success: true, 
      message: 'Agent successfully deployed to Contabo Cloud Server via Coolify.',
      agent: {
        id: dbAgent.id,
        name: normalizedName,
        status: 'running',
        webhookUrl: userHookUrl,
        containerId: containerIdTag
      }
    });

  } catch (error: any) {
    console.error('Deployment Logic Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred building the container.' }, 
      { status: 500 }
    );
  }
}
