import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definición del tipo del estado
interface AuthState {
    id_persona: number | null;
    id_restaurante: number | null;
    grupo: string | null;
    setAuthData: (id_persona: number, grupo?: string, id_restaurante?: number) => void;
    clearAuthData: () => void;
}

// Creación del store con persistencia
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            id_persona: null,
            id_restaurante: null,
            grupo: null,
            setAuthData: (id_persona, grupo, id_restaurante = undefined) =>
                set({ id_persona, grupo, id_restaurante }),
            clearAuthData: () => set({ id_persona: null, id_restaurante: null, grupo:null }),
        }),
        { name: 'auth-storage' }
    )
);
