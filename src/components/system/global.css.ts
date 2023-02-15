import { globalStyle } from "@vanilla-extract/css";

// import { vars } from "./theme.css";

import { createTheme } from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
  color: {
    brand: "blue",
  },
  font: {
    body: "arial",
  },
});

// import { style } from "styled-vanilla-extract/qwik";
// import { styled } from "styled-vanilla-extract/qwik";
// import { darkMode } from "./sprinkles.css";
// import { vars } from "./theme.css";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

globalStyle("::selection", {
  // background: vars.color.pink50,
  // color: vars.color.white,
});

globalStyle("html, body", {
  margin: 0,
  color: vars.color.brand,
});

globalStyle("body", {
  textRendering: "optimizeLegibility",
  // fontFamily: vars.fonts.body,
});

// globalStyle(`body.${darkMode}`, {
//   colorScheme: "dark",
// });
