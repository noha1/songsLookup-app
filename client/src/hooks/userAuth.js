import { useState } from "react";
import axios from "axios";

// This hook will manage authentication state (login and logout)
const useAuth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const login = async (email, password) => {
		setLoading(true);
		setError("");

		try {
			console.log("connecting to the api loging");
			const response = await axios.post("http://localhost:5000/login", {
				email,
				password,
			});

			if (response.data.success) {
				// Store user data in state (you can also store it in localStorage or sessionStorage for persistence)
				setUser({ email });
				setLoading(false);
			} else {
				setError("Invalid credentials.");
				setLoading(false);
			}
		} catch (err) {
			setError(
				"from user authentication : Something went wrong. Please try again later."
			);
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null); // Clear the user data on logout
	};

	const isAuthenticated = user !== null;

	return {
		user,
		isAuthenticated,
		login,
		logout,
		loading,
		error,
	};
};

export default useAuth;
