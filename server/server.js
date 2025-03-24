require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN; // Fetch the token
const MUSIXMATCH_API_KEY = process.env.MUSIXMATCH_API_KEY;
app.use(cors());
app.use(bodyParser.json());

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

app.get("/track", async (req, res) => {
	const { artist, title } = req.query;
	console.log('artist, title ', artist, title);
		// Check if both artist and title are provided
	if (!artist || !title) {
	  return res.status(400).json({ error: 'Artist and title are required' });
	}
	  
	try {
		  // Fetch song ID from Musixmatch API
		const trackResponse = await axios.get('https://api.musixmatch.com/ws/1.1/track.search', {
			params: {
			  q_artist: artist,  // Use the artist from the query params
			  q_track: title,    // Use the title from the query params
			  apikey: MUSIXMATCH_API_KEY,
			},
		  });
	  
		if (trackResponse.status !== 200) {
			throw new Error('Failed to process the song. Invalid response status.');
		  }
	  
		const trackId = trackResponse.data.message.body.track_list[0].track.track_id;
		  // Assuming you have the extractCountries and lyricsFinder functions already implemented
	    const lyrics = await lyricsFinder(trackId);
	    const countries = extractCountries(lyrics);  // You should make sure `extractCountries` function is correctly implemented
		const truncatedLyrics = lyrics.slice(0, 200) + '...';
	  
		  // Send response to the frontend
		res.json({ lyrics, truncatedLyrics, countries });
	} catch (error) {
		console.error('Error fetching song details!', error);
		 res.status(500).json({ error: 'An error occurred' });
		}
	  });


	const lyricsFinder = async (trackId) => {
		
		try { 
			const lyricsResponse  = await axios.get(
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
			
			//return lyricsResponse.data.message.body.lyrics.lyrics_body;
			return lyricsResponse.data?.message?.body?.lyrics?.lyrics_body ?? 'Lyrics not available';

		  } catch (error) {
			console.error('Error fetching song details!', error);
			return;
		  }};

// Route to summarize song lyrics using facehugger
app.post('/topicFinder', async (req, res) => {
	
	const { lyrics } = req.body;
	
	//mock
	const songLyrics = "I will survive, oh as long as I know how to love, I know I will stay alive";

	if (!lyrics) {
		return res.status(400).json({ error: "No song lyrics provided" });
	  }
	const data = {
	inputs: songLyrics,
};
  const headers = {
	'Authorization': `Bearer ${API_TOKEN}`,
	'Content-Type': 'application/json'
};

  try {
	const response = await axios.post(
		'https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions',
		data,
		{ headers }
	);
	if (response && response.data[0].label) {
	const summary = 'Detected Emotion:' + response.data[0].label ||  " missing topic... ";
    const score = response.data[0].score || 0;
    console.log(`The song is most likely about the emotion: ${emotion} (%: ${score.toFixed(2)})`);
	res.json({ summary });
	}
} catch (error) {
    console.error('Error fetching response from OpenAI:', error.message);
    res.status(500).json({ error: 'Failed to summarize the song' });
  }
});


// Simple country extraction method (predefined list for simplicity)
const extractCountries = (lyrics) => {
	const countries = [
		 "USA", "Canada", "Germany", "France", "Brazil", "China", "Russia", "Ukraine",
		  "India", "Mexico", "Italy", "Japan", "Spain", "Portugal", "UAE", "Portugal", "Egypt", "Lebanon"
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
