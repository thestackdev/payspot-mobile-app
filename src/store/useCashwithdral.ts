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
    current_balance: string;
  };
  setWithdrawMessage: (e: {
    status: string;
    amount: string;
    details: Details;
    receipt_url: string;
    current_balance: string;
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
    current_balance: '',
  },
  setWithdrawMessage: e =>
    set({
      cashwithdraw: {
        status: e.status,
        amount: e.amount,
        details: e.details,
        receipt_url: e.receipt_url,
        current_balance: e.current_balance,
      },
    }),
  setShowWithdrawModal: e => set({showWithdrawModal: e}),
}));

export default useCashwithdralStore;
