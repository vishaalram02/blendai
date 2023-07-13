import * as icons from "@tabler/icons";
import create from "zustand";

export const tools = [
  { icon: icons.IconHandStop, label: 'Pan Tool', customize: false, },
  { icon: icons.IconBrush, label: 'Brush', customize: true, },
  { icon: icons.IconEraser, label: 'Eraser', customize: true, },
  { icon: icons.IconWand, label: 'Magic Wand', customize: false },
  { icon: icons.IconZoomIn, label: 'Zoom In', customize: false, },
  { icon: icons.IconZoomOut, label: 'Zoom Out', customize: false, },
  { icon: icons.IconBoxMultiple, label: 'Toggle Mask', customize: false },
  { icon: icons.IconX, label: 'Clear Mask', customize: false},
];

export enum ToolType {
  Hand,
  Brush,
  Eraser,
  Wand,
  ZoomIn,
  ZoomOut,
  ToggleMask,
  ClearMask
}

interface ToolState {
  selectedTool: number;
  brushSize: number;
  changeTool: (t: number) => void;
  changeBrushSize: (t: number) => void;
}

export const useToolSelect = create<ToolState>((set) => ({
  selectedTool: ToolType.Brush,
  brushSize: 30,
  changeTool: (t: number) => set(() => ({ selectedTool: t })),
  changeBrushSize: (t: number) => set(() => ({ brushSize: t }))
}));