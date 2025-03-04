"use client";

import { useToast } from "@/hooks/useToast";
import { baseApi } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Función para verificar si estamos en el navegador
  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    // Evitar ejecución en el servidor
    if (!isBrowser) return;

    // Intenta recuperar el usuario de localStorage y cookies
    const storedToken = Cookies.get("token") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Si hay error al parsear el JSON, limpiar los datos
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Cookies.remove("token");
      }
    }

    setIsLoading(false);
  }, [isBrowser]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await baseApi.post("/auth/login", { email, password });

      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      // Guardar en localStorage y cookies para que funcione tanto con el cliente como con el middleware
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set("token", token, { expires: 7 }); // La cookie expira en 7 días

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${user.username}!`,
      });

      router.push("/");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpiar todos los lugares donde se almacena la sesión
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token");

    setUser(null);
    setToken(null);

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
