import {create} from 'zustand';

interface SessionStore {
  session: string | null;
  setSession: (session: string) => void;
}

const useSessionStore = create<SessionStore>(set => ({
  session: null,
  setSession: session => set({session}),
}));

export default useSessionStore;
