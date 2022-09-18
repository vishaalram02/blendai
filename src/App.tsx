import { useState } from 'react';
import { MantineProvider, AppShell, Center, Footer } from "@mantine/core";
import { theme } from "./theme";
import { ToolSidebar } from "./components/ToolSidebar";
import { FooterBar } from "./components/FooterBar";

import { FileUpload } from "./components/FileUpload";
import { useImageStore } from "./hooks/useImageStore";
import { PhotoEditDisplay } from './components/PhotoEditDisplay';

import { postImages } from './lib/api';

export default function App() {
  const image = useImageStore(store => store.image);

  const genImage = () => {
    const reader = new FileReader();
    if(!image){
      return;
    }
    reader.readAsDataURL(image);
    reader.onload = async function () {
      if(typeof reader.result != 'string'){
        return;
      }
      const url = await postImages(reader.result, reader.result, "orange");      
    }
  };
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <AppShell
        padding="xl"
        footer= {<FooterBar genImage={genImage}/>}
        navbar={<ToolSidebar />}
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0]
          },
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
