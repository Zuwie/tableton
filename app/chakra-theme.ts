import type { ThemeConfig } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Poppins, serif",
    mono: "Menlo, monospace",
  },
});
