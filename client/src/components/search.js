import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

function App() {
	const [artist, setArtist] = useState("");
	const [title, setTitle] = useState("");
	// eslint-disable-next-line
	const [summary, setSummary] = useState("");
	// eslint-disable-next-line
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSummary(""); // Clear previous summary

		try {
			if (!artist || !title) {
				alert("Both artist and title are required.");
				return;
			}

			const trackResponse = await axios.get("http://localhost:5000/track", {
				params: {
					artist: artist, // artist from the form input
					title: title, // title from the form input
				},
			});

			if (trackResponse.status == 200) {
				// Display the result from the backend
				const { lyrics, truncatedLyrics, countries } = trackResponse.data;
				setCountries(countries || []);

				if (lyrics == "0") {
					setError("Failed to fetch song details.");
					console.error("Failed to fetch song detials");
				}
				else{
					const topicResponse = await axios.post(
						"http://localhost:5000/topicFinder",
						{
							lyrics,
						}
					);
					console.log('i am here', lyrics, truncatedLyrics);
					setSummary(topicResponse.summary ?? truncatedLyrics);
				}
			} else {
				setError("Failed to fetch song details.")
				throw new Error("Failed to fetch track details.");
			}
		} catch (error) {
			setError("Error fetching song details")

			console.error("Error fetching song details", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className={classes.login}>
			<div>
				<h1>Song Lyrics Summary</h1>
				<form onSubmit={handleSubmit}>
					<label>
						Artist:
						<input
							type="text"
							id="artist"
							value={artist}
							onChange={(e) => setArtist(e.target.value)}
							required
						/>
					</label>
					<br />
					<label>
						Song Title:
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</label>
					<br />
					<Button type="submit">Get Song Summary</Button>
				</form>
				{loading && <p>Loading...</p>}
				{/* Error message display */}
				{error && <p>{error}</p>}
				{summary && (
					<div>
						<h2>Summary</h2>
						<p>{summary}</p>

						<h3>Countries Mentioned</h3>
						<ul>
							{countries.length > 0 ? (
								countries.map((country, index) => (
									<li key={index}>{country}</li>
								))
							) : (
								<li>No countries mentioned</li>
							)}
						</ul>
					</div>
				)}
			
			</div>
		</Card>
	);
}

export default App;
