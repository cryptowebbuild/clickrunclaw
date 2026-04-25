type CoolifyCreateServiceInput = {
  name: string;
  projectUuid: string;
  environmentUuid: string;
  serverUuid: string;
  domain?: string | null;
  env?: Record<string, string>;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function yamlQuote(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

export function buildOpenClawCompose(input: CoolifyCreateServiceInput) {
  const serviceName = 'openclaw';
  const envEntries = {
    NODE_ENV: 'production',
    OPENCLAW_GATEWAY_BIND: '0.0.0.0',
    OPENCLAW_GATEWAY_PORT: '18789',
    ...(input.domain ? { OPENCLAW_GATEWAY_CONTROLUI_ALLOWEDORIGINS: `https://${input.domain}` } : {}),
    ...(input.env || {}),
  };

  const envLines = Object.entries(envEntries)
    .map(([key, value]) => `      ${key}: ${yamlQuote(value)}`)
    .join('\n');

  const labelLines = input.domain
    ? [
        `      - traefik.enable=true`,
        `      - traefik.http.middlewares.gzip.compress=true`,
        `      - traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https`,
        `      - traefik.http.routers.http-0-${serviceName}.entryPoints=http`,
        `      - traefik.http.routers.http-0-${serviceName}.middlewares=redirect-to-https`,
        `      - ${yamlQuote(`traefik.http.routers.http-0-${serviceName}.rule=Host(\`${input.domain}\`) && PathPrefix(\`/\`)`)}`,
        `      - traefik.http.routers.http-0-${serviceName}.service=http-0-${serviceName}`,
        `      - traefik.http.routers.https-0-${serviceName}.entryPoints=https`,
        `      - traefik.http.routers.https-0-${serviceName}.middlewares=gzip`,
        `      - ${yamlQuote(`traefik.http.routers.https-0-${serviceName}.rule=Host(\`${input.domain}\`) && PathPrefix(\`/\`)`)}`,
        `      - traefik.http.routers.https-0-${serviceName}.service=https-0-${serviceName}`,
        `      - traefik.http.routers.https-0-${serviceName}.tls.certresolver=letsencrypt`,
        `      - traefik.http.routers.https-0-${serviceName}.tls=true`,
        `      - traefik.http.services.http-0-${serviceName}.loadbalancer.server.port=18789`,
        `      - traefik.http.services.https-0-${serviceName}.loadbalancer.server.port=18789`,
      ].join('\n')
    : '';

  return [
    'services:',
    `  ${serviceName}:`,
    `    image: ${yamlQuote('ghcr.io/openclaw/openclaw:2026.4.15')}`,
    '    restart: unless-stopped',
    '    expose:',
    `      - ${yamlQuote('18789')}`,
    '    environment:',
    envLines,
    '    volumes:',
    `      - ${yamlQuote('openclaw_data:/home/node')}`,
    '    deploy:',
    '      resources:',
    '        limits:',
    '          memory: 1G',
    `          cpus: ${yamlQuote('0.80')}`,
    '          pids: 256',
    '    security_opt:',
    `      - ${yamlQuote('no-new-privileges:true')}`,
    '    cap_drop:',
    `      - ${yamlQuote('ALL')}`,
    '    tmpfs:',
    `      - ${yamlQuote('/tmp:size=64m,mode=1777')}`,
    '    labels:',
    `      - ${yamlQuote('coolify.managed=true')}`,
    ...(labelLines ? [labelLines] : []),
    'volumes:',
    '  openclaw_data: null',
  ].join('\n');
}

function toBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

export async function createCoolifyService(input: CoolifyCreateServiceInput) {
  const coolifyUrl = requireEnv('CLICKRUNCLAW_COOLIFY_URL').replace(/\/$/, '');
  const coolifyToken = requireEnv('CLICKRUNCLAW_COOLIFY_TOKEN');
  const compose = buildOpenClawCompose(input);
  const body = {
    name: input.name,
    project_uuid: input.projectUuid,
    environment_uuid: input.environmentUuid,
    server_uuid: input.serverUuid,
    instant_deploy: true,
    docker_compose_raw: toBase64(compose),
    is_container_label_escape_enabled: true,
  };

  const response = await fetch(`${coolifyUrl}/api/v1/services`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${coolifyToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Coolify create service failed with status ${response.status}`);
  }

  return data as { uuid?: string; domains?: string[] };
}

export async function attachCoolifyServiceUrl(serviceUuid: string, input: { name: string; compose: string; url: string }) {
  const coolifyUrl = requireEnv('CLICKRUNCLAW_COOLIFY_URL').replace(/\/$/, '');
  const coolifyToken = requireEnv('CLICKRUNCLAW_COOLIFY_TOKEN');

  const response = await fetch(`${coolifyUrl}/api/v1/services/${serviceUuid}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${coolifyToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: input.name,
      docker_compose_raw: toBase64(input.compose),
      is_container_label_escape_enabled: true,
      urls: [{ name: 'openclaw', url: input.url }],
    }),
    cache: 'no-store',
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Coolify service URL attach failed with status ${response.status}`);
  }

  return data as { uuid?: string; domains?: string[] };
}
