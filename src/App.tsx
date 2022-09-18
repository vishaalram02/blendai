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
import { useImageStore, setImageStore } from "./hooks/useImageStore";
import { PhotoEditDisplay } from './components/PhotoEditDisplay';

import { postImages, checkProgress } from './lib/api';

export default function App() {
  const image = useImageStore(store => store.image);
  const setImage = useImageStore(store => store.updateImage)
  const [loading, setLoading] = useState(false)

   async function dataUrlToFile(dataUrl: string): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return blob    
  }

  const genImage = (prompt : string) => () => {
    console.log("PROMT", prompt)
    const reader = new FileReader();
    if(!image){
      return;
    }
    reader.readAsDataURL(image);
    reader.onload = async function () {
      if(typeof reader.result != 'string'){
        return;
      }
      setLoading(true)
      setNavigationProgress(0)
      const url = await postImages(reader.result, reader.result, prompt);
      let pollInterval = setInterval(async ()=>{
        checkProgress(url)
        .then((prog)=>{
          setNavigationProgress(5);
          if(prog.startsWith("data")){
            console.log("FINISHED PROCESSING", prog)
            clearInterval(pollInterval);
            setNavigationProgress(100);
            setLoading(false);
            dataUrlToFile(prog)
            .then((blob)=>{
              console.log("BLBOBLBLLB EHERERE", blob)
              setImage(blob)
            })
          }
          else{
            setNavigationProgress(parseInt(prog));
            console.log(prog);
          }
        })
        
      }
      , 200)
      
    }
  };
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <NavigationProgress />
      <AppShell
        padding="xl"
        footer= {<FooterBar genImage={genImage} loading={loading}/>}
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
