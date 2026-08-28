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
