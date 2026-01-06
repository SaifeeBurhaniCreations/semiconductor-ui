// import React, { createContext, useContext, useEffect, useState } from "react";

// type Role = "ADMIN" | "ENGINEER" | "OPERATOR" | "DATA_SCIENTIST";

// type User = {
//   id: string;
//   email: string;
//   role: Role;
// };

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Example: fetch current user from backend
//     async function loadUser() {
//       try {
//         const res = await fetch("/api/v1/me", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!res.ok) throw new Error("Not authenticated");

//         const data = await res.json();
//         setUser(data);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadUser();
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type Role = "ADMIN" | "ENGINEER" | "OPERATOR" | "DATA_SCIENTIST";

type User = {
  id: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const POLL_INTERVAL_MS = 10 * 60 * 1000;





export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const intervalId = setInterval(() => {
      loadUser();
    }, POLL_INTERVAL_MS);


    return () => {
      clearInterval(intervalId);
    };
  }, [loadUser]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
