import * as icons from "@tabler/icons";
import create from "zustand";

export const tools = [
  { icon: icons.IconHandStop, label: 'Pan Tool' },
  { icon: icons.IconBrush, label: 'Brush' },
  { icon: icons.IconEraser, label: 'Eraser' },
  { icon: icons.IconRectangle, label: 'Rectangle Select' },
  { icon: icons.IconZoomIn, label: 'Zoom In' },
  { icon: icons.IconZoomOut, label: 'Zoom Out' },
  { icon: icons.IconRotate2, label: 'Undo' },
  { icon: icons.IconRotateClockwise2, label: 'Redo' },
];

export enum ToolType {
  Hand,
  Brush,
  Eraser,
  Rectangle,
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