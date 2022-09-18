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

import { postImages, checkProgress } from './lib/api';

export default function App() {
  const image = useImageStore(store => store.image);
  const setImage = useImageStore(store => store.updateImage)
  const [loading, setLoading] = useState(false)
  const editor = useEditor(state => state.editor);

  async function dataUrlToFile(dataUrl: string): Promise<Blob> {
    const res: Response = await fetch(dataUrl);
    return res.blob();
  }

  const genImage = (prompt: string) => async () => {
    console.log("PROMT", prompt)
    if (!image) {
      return;
    }
    const [imageURL, maskURL] = editor!.exportImages();

    setLoading(true)
    setNavigationProgress(0)
    const url = await postImages(imageURL, maskURL, prompt);
    let pollInterval = setInterval(async () => {
      checkProgress(url)
        .then((prog) => {
          setNavigationProgress(5);
          if (prog.startsWith("data")) {
            console.log("FINISHED PROCESSING", prog)
            clearInterval(pollInterval);
            setNavigationProgress(100);
            setLoading(false);
            dataUrlToFile(prog)
              .then((blob) => {
                console.log("BLBOBLBLLB EHERERE", blob)
                setImage(blob)
              })
          }
          else {
            setNavigationProgress(parseInt(prog));
            console.log(prog);
          }
        })

    }
      , 1000)

  }

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <NavigationProgress />
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
        {image !== null ? (
          <PhotoEditDisplay file={image} />
        ) : (
          <FileUpload />
        )}
      </AppShell>
    </MantineProvider>
  );
}
