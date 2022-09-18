import create from "zustand";

interface ImageState {
    readonly image: Blob | null;
    readonly seed: number;
    updateImage: (i: Blob) => void;
    updateSeed: (i: number) => void;
}

export const useImageStore = create<ImageState>((set) => ({
    image: null,
    seed: 0,
    updateImage: (i: Blob) => set(() => ({ image: i })),
    updateSeed: (i: number) => set(() => ({ seed: i})),
}));