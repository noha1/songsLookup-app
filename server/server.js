require("dotenv").config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const MUSIXMATCH_API_KEY = "832b4eaaee025e91b12c7ec4894e8eba";
// mock login credentials 
//const users = [{ email: "test@hotmail.com", password: "password123" }];


app.post("/login", (req, res) => {

	const { email, password } = req.body;
	console.log(email, password);
	
	//const user = users.find((u) => u.email === email && u.password === password);
	res.json({ success: true });
	// if (user) {
	// 	res.json({ success: true });
	// } else {
	// 	res.status(401).json({ success: false, message: "Invalid credentials" });
	// }
});

app.get("/track",async (req, res) => {
	const { artist, title } = req.query;
	try {
		// Fetch song ID from Musixmatch API

		const trackResponse = await axios.get(
		  'https://api.musixmatch.com/ws/1.1/track.search',
		  {
			params: {
			  q_artist: "shakira",
			  q_track: "hips don't lie",
			  apikey: MUSIXMATCH_API_KEY,
			},
		  }
		);
	
		const trackId =
		trackResponse.data.message.body.track_list[0].track.track_id;
		// Fetch lyrics for the song
		// Check if the response is successful (e.g., status code is 200)
		 if (trackResponse.status !== 200) {
			throw new Error('Failed to process the song. Invalid response status.');
		  }

		const lyricsResponse = await axios.get(
		  'https://api.musixmatch.com/ws/1.1/track.lyrics.get',
		  {
			params: {
			  track_id: trackId,
			  apikey: MUSIXMATCH_API_KEY,
			},
		  }
		);
		if (lyricsResponse.status !== 200) {
			throw new Error('Failed to process the lyrics. Invalid response status.');
		  }
	
		const lyrics = lyricsResponse.data.message.body.lyrics.lyrics_body;

		const truncatedLyrics = lyrics.slice(0, 200) + '...';
		// Extract countries from lyrics (basic implementation)
		const countries = extractCountries(lyrics);
	
		// Send response to the frontend
		res.json({ truncatedLyrics, countries });
	  } catch (error) {
		console.error('Error fetching song details!', error);
		res.status(500).json({ error: 'An error occurred' });
	  }
	});


// Route to summarize song lyrics using ChatGPT
app.post('/summarise', async (req, res) => {
  const { songLyrics } = req.body;
  const apiKey ="sk-proj-UEJUbWF23vOZTGzSB5q6T3BlbkFJ7dJJuRl37aYdnaGh5VzZ";

  if (!songLyrics) {
    return res.status(400).json({ error: "No song lyrics provided" });
  }

  try {
    // Call OpenAI's API to summarize the song lyrics
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you're using GPT-4
        prompt: `Summarize this song: \n\n${songLyrics}`,
        max_tokens: 100, // adjust depending on how short or detailed you want the summary to be
        temperature: 0.7, // Adjust creativity
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data.choices[0].text.trim();
	console.log(summary);
    res.json({ summary });

  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    res.status(500).json({ error: 'Failed to summarize the song' });
  }
});
	// Simple country extraction (use a predefined list for simplicity)
const extractCountries = (lyrics) => {
	const countries = [
		  "USA", "Canada", "Germany", "France", "Brazil", 
		  "India", "Mexico", "Italy", "Japan", "Spain", "Portugal", "UAE", ""
		];
	  
		// Create a hash set (using an object)
		const countryHash = {};
		countries.forEach(country => {
		  countryHash[country.toLowerCase()] = true;
		});
	  
		const normalizedLyrics = lyrics.toLowerCase();
		const foundCountries = [];
	  
		// Split the lyrics into words and check if each word is a country
		const words = normalizedLyrics.split(/\W+/);
		words.forEach(word => {
		  if (countryHash[word] && !foundCountries.includes(word)) {
			foundCountries.push(word);
		  }
		});
	  
		return foundCountries;
	  };

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
