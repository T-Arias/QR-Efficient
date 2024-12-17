import { create } from 'zustand';

// Definición del tipo del estado
interface AuthState {
    id_persona: number | null;
    id_restaurante: number | null;
    setAuthData: (id_persona: number, id_restaurante?: number) => void;
    clearAuthData: () => void;
}

// Creación del store con Zustand
export const useAuthStore = create<AuthState>((set) => ({
    id_persona: null,
    id_restaurante: null,
    setAuthData: (id_persona, id_restaurante = undefined) =>
        set({ id_persona, id_restaurante }),
    clearAuthData: () => set({ id_persona: null, id_restaurante: null }),
}));
