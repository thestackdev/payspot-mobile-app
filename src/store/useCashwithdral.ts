import {create} from 'zustand';

export interface Details {
  balance: string;
  rrn: string;
  clientrefno: string;
  mobile: string;
  aadhar: string;
  bank_selected: string;
}

interface ModalStore {
  showWithdrawModal: boolean;
  cashwithdraw: {
    status: string;
    amount: string;
    details: Details;
    receipt_url: string;
  };
  setWithdrawMessage: (e: {
    status: string;
    amount: string;
    details: Details;
    receipt_url: string;
  }) => void;
  setShowWithdrawModal: (e: boolean) => void;
}

const useCashwithdralStore = create<ModalStore>(set => ({
  showWithdrawModal: false,
  cashwithdraw: {
    status: '',
    amount: '',
    details: {
      balance: '',
      rrn: '',
      clientrefno: '',
      mobile: '',
      aadhar: '',
      bank_selected: '',
    },
    receipt_url: '',
  },
  setWithdrawMessage: e =>
    set({
      cashwithdraw: {
        status: e.status,
        amount: e.amount,
        details: e.details,
        receipt_url: e.receipt_url,
      },
    }),
  setShowWithdrawModal: e => set({showWithdrawModal: e}),
}));

export default useCashwithdralStore;
