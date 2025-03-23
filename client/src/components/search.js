// eslint-disable-next-line
import React, { useState } from "react";
import axios from "axios"; // Import Axios for making HTTP requests

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
			const response = await axios.get("http://localhost:5000/track", {
				artist, // Data sent to the server
				title,
			});
			console.log(artist, title, response);
			// eslint-disable-next-line
			const lyrics = response.data.truncatedLyrics;
			setLoading(false);
			const res = await axios.post("http://localhost:5000/summarise", {
				lyrics, // payload
			});
			console.log(res);
			setSummary(res.summary);
			setCountries(response.data.countries);
		} catch (error) {
			console.error("Error fetching song details", error);
		} finally {
			setLoading(false);
		}
	};

	return (
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
				<button type="submit">Get Song Summary</button>
			</form>

			{loading && <p>Loading...</p>}

			{summary && (
				<div>
					<h2>Summary</h2>
					<p>{summary}</p>

					<h3>Countries Mentioned</h3>
					<ul>
						{countries.map((country, index) => (
							<li key={index}>{country}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default App;
