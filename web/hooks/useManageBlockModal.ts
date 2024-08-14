import { create } from "zustand";

type ModalProps = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useManageBlockModal = create<ModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
