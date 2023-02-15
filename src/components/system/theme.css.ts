import { precomputeValues } from "@capsizecss/vanilla-extract";
import { createTheme } from "@vanilla-extract/css";
import interFontMetrics from "@capsizecss/metrics/inter";
import colors from "tailwindcss/colors";

import { type Breakpoint } from "./theme-utils";

const grid = 4;
const px = (value: string | number) => `${value}px`;

const fontMetrics = {
  brand: {
    ...interFontMetrics,
  },
  heading: {
    ...interFontMetrics,
  },
  body: {
    ...interFontMetrics,
  },
  // TODO: better font suisse mono ?
  code: {
    ...interFontMetrics,
  },
};

const calculateTypographyStyles = (
  definition: Record<Breakpoint, { fontSize: number; rows: number }>,
  type: keyof typeof fontMetrics
) => {
  const mobile = precomputeValues({
    fontSize: definition.mobile.fontSize,
    leading: definition.mobile.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  const tablet = precomputeValues({
    fontSize: definition.tablet.fontSize,
    leading: definition.tablet.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  const desktop = precomputeValues({
    fontSize: definition.desktop.fontSize,
    leading: definition.desktop.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  return {
    mobile: {
      fontSize: mobile.fontSize,
      lineHeight: mobile.lineHeight,
      capHeightTrim: mobile.capHeightTrim,
      baselineTrim: mobile.baselineTrim,
    },
    tablet: {
      fontSize: tablet.fontSize,
      lineHeight: tablet.lineHeight,
      capHeightTrim: tablet.capHeightTrim,
      baselineTrim: tablet.baselineTrim,
    },
    desktop: {
      fontSize: desktop.fontSize,
      lineHeight: desktop.lineHeight,
      capHeightTrim: desktop.capHeightTrim,
      baselineTrim: desktop.baselineTrim,
    },
  };
};

/**
 * Shared theme Values Object
 * This is anything that doesn't change between themes and exists in all themes.
 */
export const sharedThemeValues = {
  fonts: {
    brand: '"Inter", "Helvetica Neue", HelveticaNeue, Helvetica, sans-serif',
    heading:
      '"Inter", BlinkMacSystemFont, "Helvetica Neue", HelveticaNeue, Helvetica, sans-serif',
    body: '"Inter", BlinkMacSystemFont, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
    // TODO: fix font
    code: 'ml, "Roboto Mono", Menlo, monospace',
  },
  grid: px(grid),
  spacing: {
    none: "0",
    xsmall: px(1 * grid),
    small: px(2 * grid),
    medium: px(3 * grid),
    large: px(5 * grid),
    xlarge: px(8 * grid),
    xxlarge: px(12 * grid),
    xxxlarge: px(24 * grid),
  },
  contentWidth: {
    xsmall: px(480),
    small: px(600),
    medium: px(740),
    large: px(960),
    xlarge: px(1118),
    xxlarge: px(1220),
  },
  text: {
    code: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 11, rows: 3 },
          tablet: { fontSize: 11, rows: 3 },
          desktop: { fontSize: 11, rows: 3 },
        },
        "body"
      ),
      spacing: {
        mobile: "0.02em",
        tablet: "0.02em",
        desktop: "0.02em",
      },
    },

    xxsmall: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 12, rows: 4 },
          tablet: { fontSize: 12, rows: 4 },
          desktop: { fontSize: 12, rows: 4 },
        },
        "body"
      ),
      spacing: {
        mobile: "0.02em",
        tablet: "0.02em",
        desktop: "0.02em",
      },
    },

    xsmall: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 13, rows: 4 },
          tablet: { fontSize: 13, rows: 4 },
          desktop: { fontSize: 13, rows: 4 },
        },
        "body"
      ),
      spacing: {
        mobile: "0.02em",
        tablet: "0.02em",
        desktop: "0.02em",
      },
    },

    small: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 14, rows: 5 },
          tablet: { fontSize: 14, rows: 5 },
          desktop: { fontSize: 14, rows: 5 },
        },
        "body"
      ),
      spacing: {
        mobile: "0.02em",
        tablet: "0.02em",
        desktop: "0.02em",
      },
    },

    medium: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 15, rows: 6 },
          tablet: { fontSize: 15, rows: 6 },
          desktop: { fontSize: 15, rows: 6 },
        },
        "body"
      ),
      spacing: {
        mobile: "0.04em",
        tablet: "0.04em",
        desktop: "0.04em",
      },
    },

    large: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 16, rows: 6 },
          tablet: { fontSize: 16, rows: 6 },
          desktop: { fontSize: 16, rows: 6 },
        },
        "body"
      ),
      spacing: {
        mobile: "0.04em",
        tablet: "0.04em",
        desktop: "0.04em",
      },
    },

    xlarge: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 18, rows: 7 },
          tablet: { fontSize: 18, rows: 7 },
          desktop: { fontSize: 18, rows: 7 },
        },
        "heading"
      ),
      spacing: {
        mobile: "0.04em",
        tablet: "0.04em",
        desktop: "0.04em",
      },
    },

    xxlarge: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 24, rows: 10 },
          tablet: { fontSize: 24, rows: 10 },
          desktop: { fontSize: 24, rows: 10 },
        },
        "heading"
      ),
      spacing: {
        mobile: "0em",
        tablet: "0em",
        desktop: "0em",
      },
    },

    xxxlarge: {
      calculate: calculateTypographyStyles(
        {
          mobile: { fontSize: 36, rows: 13 },
          tablet: { fontSize: 36, rows: 13 },
          desktop: { fontSize: 36, rows: 13 },
        },
        "heading"
      ),
      spacing: {
        mobile: "0em",
        tablet: "0em",
        desktop: "0em",
      },
    },
  },
  weight: {
    regular: "400",
    medium: "500",
    strong: "600",
    stronger: "700",
    extrastrong: "800",
    strongest: "900",
  },
  border: {
    width: {
      small: px(1 * grid),
      medium: px(2 * grid),
    },
    radius: {
      xsmall: px(1 * grid),
      small: px(1.5 * grid),
      medium: px(2 * grid),
      large: px(3 * grid),
      xlarge: px(4 * grid),
      xxlarge: px(5 * grid),
      xxxlarge: px(6 * grid),
      full: "9999px",
    },
  },
};

/**
 * Primitive Color values
 * These are the palette that all themes pull from
 */
export const primitiveColors = {
  white: "#fff",
  black: "#0e0e10",

  red: colors.red["500"],
  yellow: colors.yellow["300"],
  green50: colors.emerald["50"],
  green200: colors.emerald["200"],
  green300: colors.emerald["300"],
  green400: colors.emerald["400"],
  green500: colors.emerald["500"],
  green600: colors.emerald["600"],

  slate50: colors.slate["50"],
  slate100: colors.slate["100"],
  slate200: colors.slate["200"],
  slate300: colors.slate["300"],
  slate400: colors.slate["400"],
  slate500: colors.slate["500"],
  slate600: colors.slate["600"],
  slate700: colors.slate["700"],
  slate800: colors.slate["800"],
  slate900: colors.slate["900"],

  gray50: colors.gray["50"],
  gray100: colors.gray["100"],
  gray200: colors.gray["200"],
  gray300: colors.gray["300"],
  gray400: colors.gray["400"],
  gray500: colors.gray["500"],
  gray600: colors.gray["600"],
  gray700: colors.gray["700"],
  gray800: colors.gray["800"],
  gray900: colors.gray["900"],

  stone50: colors.stone["50"],
  stone100: colors.stone["100"],
  stone200: colors.stone["200"],
  stone300: colors.stone["300"],
  stone400: colors.stone["400"],
  stone500: colors.stone["500"],
  stone600: colors.stone["600"],
  stone700: colors.stone["700"],
  stone800: colors.stone["800"],
  stone900: colors.stone["900"],

  blueGray800: colors.slate["800"],
  blueGray900: colors.slate["900"],

  teal50: colors.teal["50"],
  teal100: colors.teal["100"],
  teal200: colors.teal["200"],
  teal300: colors.teal["300"],
  teal400: colors.teal["400"],
  teal500: colors.teal["500"],
  teal600: colors.teal["600"],
  teal700: colors.teal["700"],
  teal800: colors.teal["800"],
  teal900: colors.teal["900"],

  blue50: colors.sky["50"],
  blue100: colors.sky["100"],
  blue200: colors.sky["200"],
  blue300: colors.sky["300"],
  blue400: colors.sky["400"],
  blue500: colors.sky["500"],
  blue600: colors.sky["600"],
  blue700: colors.sky["700"],
  blue800: colors.sky["800"],
  blue900: colors.sky["900"],

  pink50: colors.fuchsia["50"],
  pink100: colors.fuchsia["100"],
  pink200: colors.fuchsia["200"],
  pink300: colors.fuchsia["300"],
  pink400: colors.fuchsia["400"],
  pink500: colors.fuchsia["500"],
  pink600: colors.fuchsia["600"],
  pink700: colors.fuchsia["700"],
  pink800: colors.fuchsia["800"],
  pink900: colors.fuchsia["900"],
};

/**
 * Light Theme Variable Semantic (Core) colors
 */
export const lightThemeColors = {
  colorNeutral: primitiveColors.black,
};

/**
 * Dark Theme Variable Semantic (Core) colors
 */
export const darkThemeColors = {
  colorNeutral: primitiveColors.white,
};

/**
 * Theme Shape for Vanilla Extract's createTheme
 */
export const themeShape = {
  color: {
    ...primitiveColors,
    ...lightThemeColors,
  },
  ...sharedThemeValues,
};

/**
 * Static Light Theme
 * Do not use inline for styles
 */
export const lightTheme = themeShape;

/**
 * Static Dark Theme
 * Do not use inline for styles
 */
export const darkTheme = {
  color: {
    ...primitiveColors,
    ...darkThemeColors,
  },
  ...sharedThemeValues,
};

/**
 * List of ALL themes
 */
export const themes = {
  lightTheme,
  darkTheme,
};

/**
 * Light Theme tools
 */
export const [lightThemeClass, vars] = createTheme(themeShape);

/**
 * Dark Theme tools
 * note: validated by light theme's vars so we make sure it has the same shape
 */
export const darkThemeClass = createTheme(vars, darkTheme);
