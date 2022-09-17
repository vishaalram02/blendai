import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "dark",
  colors : {
    green: ['#27B88D', '#9ACC59'],
    black: ['#000000'],
    gray: ['#4F4F4F'],
    white: ['#FFFFFF'],
  },
  defaultGradient : {
    from: '#27B88D', 
    to: '#9ACC59', 
    deg: 45,
  }
};
