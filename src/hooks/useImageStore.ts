import { FileWithPath } from "@mantine/dropzone"
import zustand, { StoreApi } from "zustand"
import create from "zustand"

interface ImageState {
    readonly image: FileWithPath | null;
    updateImage: (i: FileWithPath) => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
    image: null,
    updateImage: (i: FileWithPath) => set(() => ({ image: i }))
}));