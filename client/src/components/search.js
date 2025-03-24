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

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const trackResponse = await axios.get("http://localhost:5000/track", {
				artist, // Data sent to the server
				title,
			});

			const lyrics = trackResponse.data.truncatedLyrics;
			console.log("noha lyrics : ", trackResponse.data.truncatedLyrics);
			const topicResponse = lyrics
				? await axios.post("http://localhost:5000/topicFinder", {
						lyrics, // payload
				  })
				: " ";

			setSummary(topicResponse.summary || "No summary available");
			setCountries(trackResponse.data.countries || []);
		} catch (error) {
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
				{/* to do Display error message */}
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
