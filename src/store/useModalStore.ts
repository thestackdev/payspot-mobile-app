import {create} from 'zustand';

interface ModalStore {
  showErrorModal: boolean;
  errorMessage: {
    title: string;
    message: string;
  };
  setShowErrorModal: (showErrorModal: boolean) => void;
  setErrorMessage: (errorMessage: {title: string; message: string}) => void;
}

const useModalStoreStore = create<ModalStore>(set => ({
  showErrorModal: false,
  errorMessage: {
    title: '',
    message: '',
  },
  setErrorMessage: errorMessage => set({errorMessage}),
  setShowErrorModal: showErrorModal => set({showErrorModal}),
}));

export default useModalStoreStore;
