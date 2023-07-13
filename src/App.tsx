import { useState } from 'react';
import { MantineProvider, AppShell, Center, Footer } from "@mantine/core";
import {
  NavigationProgress,
  setNavigationProgress,
  startNavigationProgress,
  stopNavigationProgress,
} from '@mantine/nprogress';
import { theme } from "./theme";
import { ToolSidebar } from "./components/ToolSidebar";
import { FooterBar } from "./components/FooterBar";

import { FileUpload } from "./components/FileUpload";
import { useImageStore } from "./hooks/useImageStore";
import { useEditor } from "./hooks/useEditor";
import { PhotoEditDisplay } from './components/PhotoEditDisplay';

import { postImages, getStatus } from './lib/api';

export default function App() {
  const [image, cur] = useImageStore(store => [store.image, store.cur]);
  const setImage = useImageStore(store => store.updateImage);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const editor = useEditor(state => state.editor);

  async function dataUrlToFile(dataUrl: string): Promise<Blob> {
    const res: Response = await fetch(dataUrl);
    return res.blob();
  }

  const genImage = (prompt: string, seed: number) => async () => {
    if (!image.length) {
      return;
    }
    const [imageURL, maskURL] = await editor!.exportImages();

    setLoading(true)
    setNavigationProgress(0)
    const task = await postImages(imageURL, maskURL, prompt, seed);
    let pollInterval = setInterval(async () => {
      getStatus(task, seed).then(res => {
        if(res["status"] == "completed"){
          dataUrlToFile(res["bytes"]).then((blob) => {
            setImage(blob);
          })
          clearInterval(pollInterval);
          setNavigationProgress(100);
          setLoading(false);
        } else {
          setNavigationProgress(progress);
          setProgress(progress+5)
        }
      })
    }
      , 5000)

  }

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <NavigationProgress color="green.2" size={5} />
      <AppShell
        padding="xl"
        footer={<FooterBar genImage={genImage} loading={loading} />}
        navbar={<ToolSidebar />}
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0]
          },
        })}
      > 
        
        {cur > -1 ? (
          <PhotoEditDisplay file={image[cur]} />
        ) : (
          <FileUpload />
        )}
      </AppShell>
    </MantineProvider>
  );
}
