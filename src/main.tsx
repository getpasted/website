import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const story = /^\/story\/?$/.test(window.location.pathname);
// Load the archive and its styles only when visiting its direct URL.
const Story = story ? (await import("./StorySections")).StorySections : undefined;
const app = (
  <StrictMode>
    <App storyContent={Story ? <Story /> : undefined} />
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
