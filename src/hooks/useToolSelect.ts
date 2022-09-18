import { IconHandStop, IconBrush, IconBucket, IconWand, IconRectangle, IconLasso, IconColorPicker, IconZoomIn, IconEraser, IconZoomOut } from "@tabler/icons";
import create from "zustand";

export const tools = [
  { icon: IconHandStop, label: 'Pan Tool' },
  { icon: IconBrush, label: 'Brush' },
  { icon: IconEraser, label: 'Eraser' },
  { icon: IconWand, label: 'Magic Wand' },
  { icon: IconRectangle, label: 'Rectangle Select' },
  { icon: IconLasso, label: 'Lasso Tool' },
  { icon: IconZoomIn, label: 'Zoom In' },
  { icon: IconZoomOut, label: 'Zoom Out' },
];

export enum ToolType {
  Hand,
  Brush,
  Eraser,
  Wand,
  Rectangle,
  Lasso,
  ZoomIn,
  ZoomOut
}

interface ToolState {
  selectedTool: number,
  changeTool: (t: number) => void;
}

export const useToolSelect = create<ToolState>((set) => ({
  selectedTool: ToolType.Brush,
  changeTool: (t: number) => set(() => ({ selectedTool: t }))
}));