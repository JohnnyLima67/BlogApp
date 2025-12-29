import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../app/firebaseConfig"; // ajuste o caminho
import { AppRoutes } from "./app.routes";

export function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);

        // 🔑 Busca o role do usuário no Firestore
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            setRole("aluno"); // fallback se não tiver documento
          }
        } catch (err) {
          console.error("Erro ao buscar role:", err);
          setRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return null; // ou um SplashScreen / ActivityIndicator
  }

  return (
    console.log('Role do usuário - Routes Index: ', role),
    
    <AppRoutes isLoggedIn={isLoggedIn} role={role} />
  );
}