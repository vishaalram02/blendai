import { MantineProvider, AppShell } from "@mantine/core";
import { theme } from "./theme";
import { ToolSidebar } from "./components/ToolSidebar";

export default function App() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        navbar={<ToolSidebar />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {/* Put application here */}
      </AppShell>
    </MantineProvider>
  );
}
