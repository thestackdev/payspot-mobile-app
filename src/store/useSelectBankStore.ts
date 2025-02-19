import {create} from 'zustand';

interface SelectBankStore {
  selectedBank: number | null;
  setSelectedBank: (bank: number | null) => void;
}

const useSelectBankStore = create<SelectBankStore>(set => ({
  selectedBank: null,
  setSelectedBank(bank) {
    set({selectedBank: bank});
  },
}));

export default useSelectBankStore;
