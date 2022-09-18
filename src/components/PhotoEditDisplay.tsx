import { useRef, useEffect, useMemo } from "react";
import { ImageEditor } from "../lib/imageEditor";
import { Center } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useMouseState } from "../hooks/useMouseState";
import { ToolType, useToolSelect } from "../hooks/useToolSelect";
import { useEditor } from "../hooks/useEditor";

export type PhotoEditDisplayProps = {
  file: Blob;
}

function getCursor(tool: ToolType): string {
  switch (tool) {
    case ToolType.Brush:
    case ToolType.Eraser:
    case ToolType.Rectangle:
      return "crosshair";
    case ToolType.Hand:
      return "grab";
    case ToolType.ZoomIn:
      return "zoom-in";
    case ToolType.ZoomOut:
      return "zoom-out";
    default:
      return "default";
  }
}

export function PhotoEditDisplay({ file }: PhotoEditDisplayProps) {
  const { ref: containerRef, width, height } = useElementSize();
  const editor = useRef<ImageEditor | null>(null);

  const url = URL.createObjectURL(file);
  const canvasWidth = useMemo(() => Math.floor(width * 0.9), [width]);
  const canvasHeight = useMemo(() => Math.floor(height * 0.9), [height]);
  const { ref: canvasRef } = useMouseState(editor);
  const tool = useToolSelect(store => store.selectedTool);
  const setEditor = useEditor(store => store.setEditor);

  useEffect(() => {
    if (canvasRef.current !== null && editor.current === null) {
      const img = new Image;

      img.onload = async function () {
        editor.current = new ImageEditor({
          canvas: canvasRef.current!,
          initialTool: tool,
          image: await createImageBitmap(this as HTMLImageElement)
        });
      };

      img.src = url;
    }
  }, [canvasRef, height, width]);

  useEffect(() => {
    if (editor.current !== null) {
      const img = new Image;

      img.onload = async function () {
        editor.current!.updateImage(await createImageBitmap(this as HTMLImageElement))
      };

      img.src = url;
    }
  }, [file]);

  useEffect(() => {
    if (editor.current !== null) {
      editor.current.resizeBackbuffer();
      editor.current.render();
    }
  }, [editor, canvasWidth, canvasHeight]);

  useEffect(() => {
    console.log("tool changed");
    if (editor.current !== null) {
      editor.current.updateTool(tool);
    }
  }, [tool]);

  useEffect(() => {
    setEditor(editor.current);
  }), [editor];

  return (
    <Center ref={containerRef} sx={{ height: "100%", "&:hover": { cursor: getCursor(tool) } }}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Center>
  );
}