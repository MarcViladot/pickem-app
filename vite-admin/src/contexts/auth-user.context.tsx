import React, {createContext, useContext, Context, useState, useMemo} from 'react';
import {User} from '../interfaces/User';

interface AuthUserContextProps {
  authUser: User | null;
  isAuthenticated: boolean;
  setAuthUser?: (user: User | null) => void;
}

const AuthUserContext = createContext<AuthUserContextProps>({
  authUser: null,
  isAuthenticated: false,
});

export function AuthUserProvider({ children }: { children: React.ReactNode }) {

  const [authUser, setAuthUser]  = useState(null);
  const isAuthenticated = useMemo(() => !!authUser, [authUser]);

  return (
    <AuthUserContext.Provider value={{authUser, setAuthUser, isAuthenticated}}>{children}</AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);
