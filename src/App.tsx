import { MantineProvider, AppShell, Navbar } from "@mantine/core";
import { theme } from "./theme";

export default function App() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {/* Put application here */}
      </AppShell>
    </MantineProvider>
  );
}
