import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  colorScheme: "dark",
  colors : {
    green: ['#155340', '#27B88D', '#9ACC59', '#B0CC8A'],
    black: ['#000000'],
    gray: ['#4F4F4F'],
    white: ['#FFFFFF'],
  },
  defaultGradient : {
    from: '#27B88D', 
    to: '#B0CC8A', 
    deg: 45,
  }
};
