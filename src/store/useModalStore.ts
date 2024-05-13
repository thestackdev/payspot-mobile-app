import {create} from 'zustand';

interface ModalStore {
  showErrorModal: boolean;
  showSuccessModal: boolean;
  errorMessage: {
    title: string;
    message: string;
  };
  successMessage: {
    title: string;
    message: string;
  };
  setShowErrorModal: (showErrorModal: boolean) => void;
  setShowSuccessModal: (showSuccessModal: boolean) => void;
  setErrorMessage: (errorMessage: {title: string; message: string}) => void;
  setSuccessMessage: (successMessage: {title: string; message: string}) => void;
}

const useModalStoreStore = create<ModalStore>(set => ({
  showErrorModal: false,
  showSuccessModal: false,
  errorMessage: {
    title: '',
    message: '',
  },
  successMessage: {
    title: '',
    message: '',
  },
  setErrorMessage: errorMessage => set({errorMessage}),
  setSuccessMessage: successMessage => set({successMessage}),
  setShowErrorModal: showErrorModal => set({showErrorModal}),
  setShowSuccessModal: showSuccessModal => set({showSuccessModal}),
}));

export default useModalStoreStore;
