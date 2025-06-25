import twColors from "tailwindcss/colors";

const colors = {
  gray: {
    ...twColors.gray,
    150: "#EBEDF0",
  },
  slate: {
    ...twColors.slate,
    150: "#E9EEF5",
  },
  neutral: {
    ...twColors.neutral,
    150: "#EDEDED",
  },
  navy: {
    50: "#E7E9EF",
    100: "#C2C9D6",
    200: "#A5AFC4",
    300: "#6D7EA1",
    400: "#5C6B8A",
    450: "#465675",
    500: "#384766",
    600: "#313E59",
    700: "#24314A",
    750: "#222E45",
    800: "#202B40",
    900: "#182030",
  },
  mirage: {
    50: "#DDE5F5",
    100: "#B4BFD9",
    200: "#9EAAC4",
    300: "#6C7C9E",
    400: "#3D4E70",
    450: "#293859",
    500: "#1E2B47",
    600: "#1A2640",
    700: "#101A2E",
    750: "#0F1729",
    800: "#0C1221",
    900: "#050A16",
  },
  black: {
    50: "#EBEBED",
    100: "#D9D9DE",
    200: "#C5C5CC",
    300: "#93939C",
    400: "#4A4A4F",
    450: "#333338",
    500: "#242428",
    600: "#1F1F21",
    700: "#131314",
    750: "#0C0C0D",
    800: "#080809",
    900: "#000000",
  },
  mint: {
    50: "#E1E5EA",
    100: "#C5CCD3",
    200: "#A0ABB6",
    300: "#70838F",
    400: "#506877",
    450: "#384954",
    500: "#2A3942",
    600: "#242F38",
    700: "#152129",
    750: "#111B22",
    800: "#0D161C",
    900: "#0A1014",
  },
  cinder: {
    50: "#E6E7EB",
    100: "#D0D2DB",
    200: "#B7BAC4",
    300: "#838794",
    400: "#4C4F57",
    450: "#383A41",
    500: "#2A2C32",
    600: "#232429",
    700: "#1C1D21",
    750: "#1A1B1F",
    800: "#15161A",
    900: "#0E0F11",
  },

  Neruopi: {
    50: "#00C9EA",
    100: "#83CAE6",
    200: "#8FD1E6",
    300: "#437EB4",
    400: "#2F469A",
    450: "#2F469A",
    500: "#2F469A",
    600: "#465C8A",
    700: "#465C8A",
    750: "#03366",
    800: "#002E5D",
    900: "#1A4255",
  },


  salesRed: {
  50:  "#FFEAEA",   // light blush red
  100: "#FFC7C7",   // soft red
  200: "#FF9D9D",   // salmon red
  300: "#FF6B6B",   // moderate red (common button color)
  400: "#F44336",   // vivid red (alert color)
  450: "#E53935",   // slightly deeper
  500: "#D32F2F",   // primary red
  600: "#C62828",   // darkened
  700: "#B71C1C",   // deeper for hover or dark themes
  750: "#A31616",   // dark wine red
  800: "#8B0000",   // strong dark red (border/shadow)
  900: "#5B0000",   // almost maroon (footer, dark mode bg)
},


  indigo: twColors.indigo,
  blue: twColors.blue,
  green: twColors.green,
  amber: twColors.amber,
  purple: twColors.purple,
  rose: twColors.rose,
  variants: {
    "secondary-lighter": "#FF75DF",
    "secondary-light": "#FF2ECF",
    secondary: "#E000AD",
    "secondary-darker": "#B8008C",
    "info-lighter": twColors.sky["400"],
    "info-light": twColors.sky["500"],
    info: twColors.sky["600"],
    "info-darker": twColors.sky["700"],
    "success-lighter": twColors.emerald["400"],
    "success-light": twColors.emerald["500"],
    success: twColors.emerald["600"],
    "success-darker": twColors.emerald["700"],
    "warning-lighter": "#FFBA42",
    "warning-light": "#FFA71A",
    warning: "#F59200",
    "warning-darker": "#DB7C00",
    "error-lighter": "#FF8A5C",
    "error-light": "#FF6933",
    error: "#FF4F1A",
    "error-darker": "#E52E00",
  },
};

export { twColors, colors };
