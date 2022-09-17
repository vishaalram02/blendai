import { useRef, useEffect } from "react";
import { ImageEditor, LayerNames } from "../lib/image-editor";
import { Center } from "@mantine/core";
import { useElementSize, useResizeObserver } from "@mantine/hooks";
import { useMouseState } from "../hooks/useMouseState";

export type PhotoEditDisplayProps = {
  file: File;
}

export function PhotoEditDisplay({ file }: PhotoEditDisplayProps) {
  const { ref: containerRef, width, height } = useElementSize();
  const editor = useRef<ImageEditor | null>(null);

  const url = URL.createObjectURL(file);
  const canvasWidth = Math.floor(width * 0.9);
  const canvasHeight = Math.floor(height * 0.9);
  const { mousePosition, ref: canvasRef } = useMouseState(editor);
  const [resizeRef, _] = useResizeObserver();

  console.log(mousePosition);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const img = new Image;

      img.onload = async function () {
        editor.current = new ImageEditor({ canvas: canvasRef.current!, image: await createImageBitmap(this as HTMLImageElement) });
      };

      img.src = url;
    }
  }, [canvasRef, height, width]);

  useEffect(() => {
    if (resizeRef.current !== null) {
      if (editor.current !== null) {
        editor.current.resizeBackbuffer();
      }
    }
  }, [resizeRef]);

  // if (!!editor.current) {
  //   console.log(editor.current.layers[LayerNames.Base].element.toDataURL());
  // }

  // useEffect(() => {
  //   if (!!imageRef.current) {
  //     const imageWidth = imageRef.current.width;
  //     const imageHeight = imageRef.current.height;

  //     const aspectRatio = imageHeight / imageWidth;
  //     let actualWidth: number;
  //     let actualHeight: number;

  //     console.log(imageWidth, imageHeight, width, height);

  //     if (aspectRatio > 1) {
  //       actualHeight = Math.min(height * 0.9, imageHeight);
  //       actualWidth = actualHeight / aspectRatio;
  //     } else {
  //       actualWidth = Math.min(width * 0.9, imageWidth);
  //       actualHeight = actualWidth * aspectRatio;
  //     }

  //     setSize({ width: actualWidth, height: actualHeight });

  //     console.log({ width: actualWidth, height: actualHeight });
  //   }
  // }, [imageRef]);


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
      <Center ref={resizeRef} sx={{ height: "100%", width: "100%" }}>
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
        {/* <img
        width={size ? size.width : undefined}
        height={size ? size.height : undefined}
        style={{ objectFit: 'contain', maxWidth: '100%', height: "auto" }}
        ref={imageRef}
        src={url}
      /> */}
      </Center>
    </Center>
  );
}