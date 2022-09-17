import create from "zustand";

interface ImageState {
    readonly image: File | null;
    updateImage: (i: File) => void;
}

export const useImageStore = create<ImageState>((set) => ({
    image: null,
    updateImage: (i: File) => set(() => ({ image: i })),
}));