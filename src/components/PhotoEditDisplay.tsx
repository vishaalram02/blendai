import { useRef, useEffect, useState } from "react";
import { ImageEditor } from "../lib/image-editor";
import { Image, Center } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { IconMathFunction } from "@tabler/icons";

export type PhotoEditDisplayProps = {
  file: File;
}

// function createImage(file: File): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(file);
//     const img = new Image;

//     img.onload = () => {
//       resolve(img);
//     };

//     img.src = url;
//   });
// }

// function useFileSize(file: File) {
//   const [state, setState] = useState<HTMLImageElement | null>(null);

//   useEffect(() => {
//     const createImageAsync = async () => {
//       setState(await createImage(file));
//     };

//     createImageAsync().catch(console.error);
//   }, []);

//   return state;
// }

type Size = { width: number, height: number };

export function PhotoEditDisplay({ file }: PhotoEditDisplayProps) {
  // const editor = useRef<ImageEditor | null>(null);
  const { ref: containerRef, width, height } = useElementSize();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const url = URL.createObjectURL(file);

  useEffect(() => {
    if (!!imageRef.current) {
      const imageWidth = imageRef.current.width;
      const imageHeight = imageRef.current.height;

      const aspectRatio = imageHeight / imageWidth;
      let actualWidth: number;
      let actualHeight: number;

      console.log(imageWidth, imageHeight, width, height);

      if (aspectRatio > 1) {
        actualHeight = Math.min(height * 0.9, imageHeight);
        actualWidth = actualHeight / aspectRatio;
      } else {
        actualWidth = Math.min(width * 0.9, imageWidth);
        actualHeight = actualWidth * aspectRatio;
      }

      setSize({ width: actualWidth, height: actualHeight });

      console.log({ width: actualWidth, height: actualHeight });
    }
  }, [imageRef]);


  // useEffect(() => {
  //   if (!!canvas.current) {
  //     editor.current = new ImageEditor({
  //       canvas: canvas.current
  //     });
  //     editor.current.initialize();
  //   }
  // }, [canvas]);

  return (
    <Center ref={containerRef} sx={{ height: "100%" }}>
      {/* <canvas
        style={{ backgroundColor: "white" }}
        width={canvasWidth}
        height={canvasHeight}
      /> */}
      <img
        style={{ objectFit: 'contain', maxWidth: '100%', height: "auto" }}
        ref={imageRef}
        src={url}
      />
    </Center>
  );
}