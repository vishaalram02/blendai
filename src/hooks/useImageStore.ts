import create from "zustand";

interface ImageState {
    readonly image: Blob[];
    readonly cur: number;
    readonly seed: number;
    updateImage: (i: Blob) => void;
    deleteImage: () => void;
    updateSeed: (i: number) => void;
    undo: () => void;
    redo: () => void;
}

export const useImageStore = create<ImageState>((set, get) => ({
    image: [],
    seed: 1,
    cur: -1,
    updateImage: (i: Blob) => {
        const current = get();
        const arr = [...current.image.slice(current.cur), i];
        set(() => ({ image: [...current.image.slice(0,current.cur+1), i], cur: current.cur+1 }))
    },
    deleteImage: () => set(() => ({image: [], cur: -1})),
    updateSeed: (i: number) => set(() => ({ seed: i})),
    undo: () => set(() => ({cur: Math.max(-1, get().cur-1)})),
    redo: () => set(() => ({cur: Math.min(get().image.length-1, get().cur+1)})),
}));