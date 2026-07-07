<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into DevEvent, a Next.js 16 App Router application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+). A reverse proxy is configured in `next.config.ts` to route PostHog ingestion through `/ingest` — this improves ad-blocker resilience and keeps all traffic on your domain. Environment variables are stored in `.env.local`. Three user interactions are instrumented: the hero CTA button, featured event cards, and all navigation links.

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | Fired when a user clicks the 'Explore Events' hero CTA button. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | Fired when a user clicks a featured event card. Properties: `event_title`, `event_slug`, `event_location`, `event_date`. | `components/EventCard.tsx` |
| `nav_link_clicked` | Fired when a user clicks any navigation link. Property: `label` (e.g. "Home", "Events", "Create Event", "logo"). | `components/NavBar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/488810/dashboard/1769456)
- [Explore Events CTA — Total Clicks](https://us.posthog.com/project/488810/insights/oNuQ68VM)
- [Event Card Clicks Over Time](https://us.posthog.com/project/488810/insights/ChRxqenK)
- [Most Clicked Events by Title](https://us.posthog.com/project/488810/insights/UwMFDkll)
- [Navigation Link Clicks by Label](https://us.posthog.com/project/488810/insights/YBRGw6ha)
- [CTA to Event Card Conversion Funnel](https://us.posthog.com/project/488810/insights/NeTL48SQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
