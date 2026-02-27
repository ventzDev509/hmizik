import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  bgblack:string;
  bgsecondary:string;
  bgGradient:string;
  grayOpacity:string
}

interface FontSizes {
  title: string;
  subtitle: string;
  p: string;
}

interface ThemeState {
  colors: ThemeColors;
  font: string;
  sizes: FontSizes;
}

const initialState: ThemeState = {
  colors: {
    primary: "text-green-500",     // Tailwind class
    secondary: "text-gray-900",
    accent: "text-white",
    background: "bg-gray-900",
    text: "text-white",
    bgblack:"bg-black",
    bgsecondary: "bg-gray-900",
    bgGradient:"bg-gradient-to-b from-[#121212] to-[#0f0f0f]",
    grayOpacity:"bg-[#6a6a6a21]"
  },
  font: "'Inter', sans-serif",
  sizes: {
    title: "text-4xl",      // H1
    subtitle: "text-2xl",   // H2
    p: "text-base",         // paragraph
  },
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColors: (state, action: PayloadAction<Partial<ThemeColors>>) => {
      state.colors = { ...state.colors, ...action.payload };
    },
    setFont: (state, action: PayloadAction<string>) => {
      state.font = action.payload;
    },
    setSizes: (state, action: PayloadAction<Partial<FontSizes>>) => {
      state.sizes = { ...state.sizes, ...action.payload };
    },
  },
});

export const { setColors, setFont, setSizes } = themeSlice.actions;
export default themeSlice.reducer;
