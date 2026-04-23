import { randomUUID } from 'node:crypto';
import { getDb, withTransaction } from './sqlite';

export type AgentRecord = {
  id: string;
  user_id: string;
  name: string;
  provider: string;
  status: string;
  plan_snapshot: string | null;
  webhook_url: string | null;
  telegram_status: string | null;
  coolify_service_uuid: string | null;
  coolify_application_uuid: string | null;
  deployment_source: string | null;
  deployment_status_detail: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapAgent(row: any): AgentRecord {
  return row as AgentRecord;
}

export function upsertLocalUser(input: {
  id: string;
  email?: string | null;
  fullName?: string | null;
  planTier?: string | null;
}) {
  const db = getDb();
  db.prepare(
    `INSERT INTO users (id, email, full_name, plan_tier, updated_at)
     VALUES (@id, @email, @full_name, @plan_tier, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       email = excluded.email,
       full_name = COALESCE(excluded.full_name, users.full_name),
       plan_tier = COALESCE(excluded.plan_tier, users.plan_tier),
       updated_at = CURRENT_TIMESTAMP`
  ).run({
    id: input.id,
    email: input.email ?? null,
    full_name: input.fullName ?? null,
    plan_tier: input.planTier ?? 'free',
  });
}

export function createLocalAgent(input: {
  userId: string;
  name: string;
  provider: string;
  planSnapshot: string;
  telegramStatus?: string | null;
  deploymentStatusDetail?: string | null;
  apiKey?: string | null;
  telegramBotToken?: string | null;
}) {
  return withTransaction(() => {
    const db = getDb();
    const agentId = randomUUID();
    const deploymentId = randomUUID();
    const webhookUrl = `https://hook.clickrunclaw.com/a/${agentId.split('-')[0]}`;

    db.prepare(
      `INSERT INTO agents (
        id, user_id, name, provider, status, plan_snapshot, webhook_url,
        telegram_status, deployment_status_detail, deployment_source
      ) VALUES (
        @id, @user_id, @name, @provider, 'deploying', @plan_snapshot, @webhook_url,
        @telegram_status, @deployment_status_detail, 'clickrunclaw'
      )`
    ).run({
      id: agentId,
      user_id: input.userId,
      name: input.name,
      provider: input.provider,
      plan_snapshot: input.planSnapshot,
      webhook_url: webhookUrl,
      telegram_status: input.telegramStatus ?? 'none',
      deployment_status_detail: input.deploymentStatusDetail ?? 'Deployment requested',
    });

    db.prepare(
      `INSERT INTO agent_secrets (
        agent_id, api_key_ciphertext, telegram_bot_token_ciphertext
      ) VALUES (
        @agent_id, @api_key_ciphertext, @telegram_bot_token_ciphertext
      )`
    ).run({
      agent_id: agentId,
      api_key_ciphertext: input.apiKey ?? null,
      telegram_bot_token_ciphertext: input.telegramBotToken ?? null,
    });

    db.prepare(
      `INSERT INTO agent_deployments (
        id, agent_id, requested_by_user_id, status, trigger_kind, error_message
      ) VALUES (
        @id, @agent_id, @requested_by_user_id, 'queued', 'dashboard', NULL
      )`
    ).run({
      id: deploymentId,
      agent_id: agentId,
      requested_by_user_id: input.userId,
    });

    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
    return mapAgent(agent);
  });
}
