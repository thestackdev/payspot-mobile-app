import {create} from 'zustand';

export interface Result {
  message: string;
  bank_selected: string;
  aadhar: string;
  balance: string;
  rrn: string;
}

interface ModalStore {
  showMiniStatementModal: boolean;
  miniStatement: {
    result: Result;
    result_statement: string[];
    receipt_url: string;
  };
  setMiniStatementMessage: (e: {
    result: Result;
    result_statement: string[];
    receipt_url: string;
  }) => void;
  setShowMiniStatementModal: (e: boolean) => void;
}

const useMiniStatementStore = create<ModalStore>(set => ({
  showMiniStatementModal: false,
  miniStatement: {
    result: {
      message: '',
      bank_selected: '',
      aadhar: '',
      balance: '',
      rrn: '',
    },
    result_statement: [],
    receipt_url: '',
  },
  setMiniStatementMessage: e =>
    set({
      miniStatement: {
        result: e.result,
        result_statement: e.result_statement,
        receipt_url: e.receipt_url,
      },
    }),
  setShowMiniStatementModal: e => set({showMiniStatementModal: e}),
}));

export default useMiniStatementStore;
