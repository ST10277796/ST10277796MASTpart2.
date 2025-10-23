import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  role: "chef" | "client";
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("christoffel_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("christoffel_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo credentials
    const chefEmail = "chef@christoffel.com";
    const chefPassword = "chef123";
    const clientEmail = "client@example.com";
    const clientPassword = "client123";

    if (
      (email === chefEmail && password === chefPassword) ||
      email === "demo@chef.com"
    ) {
      const newUser: User = {
        id: "chef-001",
        email: email,
        role: "chef",
        name: "Christoffel",
      };
      setUser(newUser);
      localStorage.setItem("christoffel_user", JSON.stringify(newUser));
    } else if (email === clientEmail && password === clientPassword) {
      const newUser: User = {
        id: "client-001",
        email: email,
        role: "client",
        name: "Guest",
      };
      setUser(newUser);
      localStorage.setItem("christoffel_user", JSON.stringify(newUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("christoffel_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
