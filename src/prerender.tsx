import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { StorySections } from "./StorySections";

export function render(story = false) {
  return renderToString(
    <StrictMode>
      <App storyContent={story ? <StorySections /> : undefined} />
    </StrictMode>,
  );
}
