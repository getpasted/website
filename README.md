# Pasted website

The public website for [Pasted](https://github.com/getpasted/pasted), a fast,
private clipboard manager.

## Development

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Run `npm test` before publishing. Pushing `main` deploys the static `dist/`
output to GitHub Pages.

The production build pre-renders the React homepage for crawlers and no-script
clients, then audits the generated metadata, sitemap, focused landing pages,
and public deploy assets. Release-selection unit tests protect the download
card from mistaking mutable updater-channel releases for versioned builds.

The unlinked `/story/` archive preserves retired home-page sections. It is
pre-rendered with `noindex, nofollow`, excluded from the sitemap, and loads its
interactive code and stylesheet separately from the home page.

The `/thanks/` payment-confirmation page is intentionally sparse. Its compact
footer omits the shared grouped navigation and `footer.css` so the page stays
focused on the confirmation and return actions. It is an intentional exception
to the shared footer layout used by the main site and standalone landing pages.
