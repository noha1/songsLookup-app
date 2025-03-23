import React, { createContext, useContext } from "react";
import useAuth from "../hooks/userAuth";

const AuthContext = createContext();

// Provide Auth context to all components
export const AuthProvider = ({ children }) => {
	const auth = useAuth();

	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuthContext = () => {
	return useContext(AuthContext);
};
