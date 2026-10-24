import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://antikeylist.com",
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
