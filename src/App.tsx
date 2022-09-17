import { useState } from 'react';
import { MantineProvider, AppShell, Center } from "@mantine/core";
import { theme } from "./theme";
import { ToolSidebar } from "./components/ToolSidebar";
import { FileUpload } from "./components/FileUpload";
import { Image } from "./components/Image";
import { useImageStore } from "./hooks/useImageStore";

export default function App() {
  const [upload, setUpload] = useState(false);
  const success = useImageStore(store => !!store.image);

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="md"
        navbar={<ToolSidebar />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <Center style={{height: "80%"}}>
          {success ? (<Image />) : (<FileUpload />)}
        </Center>
        
      </AppShell>
    </MantineProvider>
  );
}
