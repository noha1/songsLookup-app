import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import Login from "./components/login";
import Search from "./components/search";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/search" element={<Search />} />
			</Routes>
		</Router>
	);
}

export default App;
