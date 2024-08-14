import { create } from "zustand";

type StatusProps = {
    status: boolean;
    onChange: (status: boolean) => void;
};

export const usePartnerStatus = create<StatusProps>((set) => ({
    status: false,
    onChange: (status) => set({ status }),
}));
