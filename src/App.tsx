import { useState } from 'react';
import { MantineProvider, AppShell, Center } from "@mantine/core";
import { theme } from "./theme";
import { ToolSidebar } from "./components/ToolSidebar";
import { FileUpload } from "./components/FileUpload";
import { useImageStore } from "./hooks/useImageStore";
import { PhotoEditDisplay } from './components/PhotoEditDisplay';

export default function App() {
  const image = useImageStore(store => store.image);

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="xl"
        navbar={<ToolSidebar />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {image !== null ? (
          <PhotoEditDisplay file={image} />
        ) : (
          <FileUpload />
        )}
      </AppShell>
    </MantineProvider>
  );
}
