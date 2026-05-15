import { defineConfig } from "tailwindcss";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",   
        secondary: "#191414", 
        accent: "#ffffff",    
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
});
