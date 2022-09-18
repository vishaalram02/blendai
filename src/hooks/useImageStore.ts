import create from "zustand";

interface ImageState {
    readonly image: File | null;
    readonly seed: number;
    updateImage: (i: File | null) => void;
    updateSeed: (i: number) => void;
}

export const useImageStore = create<ImageState>((set) => ({
    image: null,
    seed: 0,
    updateImage: (i: File | null) => set(() => ({ image: i })),
    updateSeed: (i: number) => set(() => ({ seed: i})),
}));