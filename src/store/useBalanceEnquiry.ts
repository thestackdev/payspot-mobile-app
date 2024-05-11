import {create} from 'zustand';

interface ModalStore {
  showBalanceEnquiryModal: boolean;
  balanceEnquiry: {
    bank_selected: string;
    mobile: string;
    aadhar: string;
    balance: string;
    rrn: string;
    transaction_id: string;
    receipt_url: string;
  };
  setBalanceEnquiryMessage: (e: {
    bank_selected: string;
    mobile: string;
    aadhar: string;
    balance: string;
    rrn: string;
    transaction_id: string;
    receipt_url: string;
  }) => void;
  setShowBalanceEnquiryModal: (e: boolean) => void;
}

const useBalanceEnquiryStore = create<ModalStore>(set => ({
  showBalanceEnquiryModal: false,
  balanceEnquiry: {
    bank_selected: '',
    mobile: '',
    aadhar: '',
    balance: '',
    rrn: '',
    transaction_id: '',
    receipt_url: '',
  },
  setBalanceEnquiryMessage: e =>
    set({
      balanceEnquiry: {
        bank_selected: e.bank_selected,
        mobile: e.mobile,
        aadhar: e.aadhar,
        balance: e.balance,
        rrn: e.rrn,
        transaction_id: e.transaction_id,
        receipt_url: e.receipt_url,
      },
    }),
  setShowBalanceEnquiryModal: e =>
    set({
      showBalanceEnquiryModal: e,
    }),
}));

export default useBalanceEnquiryStore;
