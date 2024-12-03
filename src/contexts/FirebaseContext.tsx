import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

interface FirebaseContextType {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  isAdmin: false,
  loading: true,
  error: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: FirebaseUser | null) => {
      if (user) {
        try {
          const adminsRef = collection(db, 'admins'); // Referencia a la colección de administradores
          const snapshot = await getDocs(adminsRef);
          
          // Busca si el UID del usuario existe en la lista de administradores
          const isUserAdmin = snapshot.docs.some((doc) => doc.id === user.uid);

          setIsAdmin(isUserAdmin);
          setError(null); // Si no hay errores, limpia el estado de error
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setError('No se pudo verificar el estado de administrador.'); // Mensaje claro para depuración
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false); // Solo desactiva la carga después de completar las verificaciones
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ isAdmin, loading, error }}>
      {children}
    </FirebaseContext.Provider>
  );
};
