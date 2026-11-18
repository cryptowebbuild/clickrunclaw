/**
 * Shared site constants. Copy, prices and links that appear in more than
 * one place live here so they cannot drift between pages.
 */

export const SITE = {
  name: 'ClickRunClaw',
  legalName: 'ClickRunClaw',
  url: 'https://clickrunclaw.com',
  email: 'support@clickrunclaw.com',
  founder: 'Sagor Ahamed',
  studio: 'CryptoWebBuild',
  studioUrl: 'https://cryptowebbuild.com',
  description:
    'ClickRunClaw builds custom AI agents and workflow automations for European businesses: dedicated EU infrastructure, fixed pricing, async delivery and full code ownership.',
  regions: ['Frankfurt, Germany', 'Helsinki, Finland'],
  social: {
    x: 'https://x.com/clickrunclaw',
    facebook: 'https://facebook.com/ClickRunClaw',
    telegram: 'https://t.me/ClickRunClaw',
    github: 'https://github.com/cryptowebbuild/clickrunclaw',
  },
} as const;

export const GA_ID = 'G-DVW4J1GF1L';
