import create from "zustand";
import { ImageEditor } from "../lib/imageEditor";

type EditorState = {
  editor: ImageEditor | null,
  setEditor: (i: ImageEditor | null) => void;
}

export const useEditor = create<EditorState>((set) => ({
  editor: null,
  setEditor: (i: ImageEditor | null) => set({ editor: i })
}));