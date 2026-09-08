import type { Plugin } from "vite";

// Vite's SPA fallback otherwise serves the homepage for these directory URLs.
export function staticPages(): Plugin {
  return {
    name: "pasted-static-pages",
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const incoming = request as { url?: string };
        if (incoming.url) {
          incoming.url = incoming.url.replace(
            /^\/(features|download|cli|privacy|thanks)\/?(?=\?|$)/,
            "/$1/index.html",
          );
        }
        next();
      });
    },
  };
}
