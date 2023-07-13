import React from "react";
import { useMove } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ImageEditor } from "../lib/imageEditor";

export function useMouseState(editor: React.MutableRefObject<ImageEditor | null>) {
  const [value, setValue] = useState<{ x: number, y: number }>({ x: -1, y: -1 });
  const { ref } = useMove(setValue);

  useEffect(() => {
    if (editor.current && value.x >= 0 && value.y >= 0) {
      editor.current.updatePosition(value.x, value.y);
    }
  }, [value, editor]);

  return { ref: ((ref as unknown) as React.MutableRefObject<HTMLCanvasElement>), mousePosition: value };
}