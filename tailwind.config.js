import { defineConfig } from "tailwindcss";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",   // vert Spotify
        secondary: "#191414", // noir Spotify
        accent: "#ffffff",    // blanc
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
});
