import { useRef, useEffect } from "react";
import { FileWithPath } from "@mantine/dropzone";
import { ImageEditor } from "../lib/image-editor";
import { Container } from "@mantine/core";

export function PhotoEditDisplay(image: FileWithPath) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const editor = useRef<ImageEditor | null>(null);

  useEffect(() => {
    if (!!canvas.current) {
      editor.current = new ImageEditor({ file: image, canvas: canvas.current });
      editor.current.initialize();
    }
  }, [canvas, image]);

  return (
    <Container>

    </Container>
  );
}