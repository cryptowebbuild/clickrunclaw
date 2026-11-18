# Contributing

This is the production site for a small studio, so changes are kept deliberately narrow.

## Before you open a pull request

```bash
npm ci
npx tsc --noEmit
npm test
npm run build
```

All four must pass. The CI workflow runs the same sequence.

## Rules of the house

- **Copy is product.** Prices, delivery windows and metrics live in one place (`lib/blog.ts`, `lib/site.ts`, or the page that owns them). Do not duplicate a number into a second file.
- **No new colour tokens without a reason.** The palette is ink, panel, hairline and one coral accent. A second accent means something is wrong.
- **Accessibility is not optional.** Icon-only buttons need an accessible name; focus states must stay visible; motion must respect `prefers-reduced-motion`.
- **Keep pages pre-rendered.** Do not add `runtime = 'edge'` to a page. Edge runtime on a page disables static generation and costs latency for no benefit.
- **Never claim delivery that did not happen.** If the lead dispatcher cannot reach a provider, the API must fail honestly. Do not "fix" a `502` by returning `200`.

## Commit style

`type(scope): summary` in the imperative, for example:

```
fix(api): stop reporting success when no lead channel accepted the brief
```

## Reporting a security issue

See [SECURITY.md](SECURITY.md). Do not open a public issue.
