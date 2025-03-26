// Simple country extraction method (predefined list for simplicity)
const extractCountries = (lyrics) => {
	if (!lyrics){return;}
	const countries = [
		"USA",
		"Canada",
		"Germany",
		"France",
		"Brazil",
		"China",
		"Russia",
		"Ukraine",
		"Uk",
		"India",
		"Mexico",
		"Italy",
		"Japan",
		"Spain",
		"Portugal",
		"UAE",
		"Portugal",
		"Egypt",
		"Lebanon",
	];

	// Create a hash set (using an object)
	const countryHash = {};
	countries.forEach((country) => {
		countryHash[country.toLowerCase()] = true;
	});

	const normalizedLyrics = lyrics.toLowerCase();
	const foundCountries = [];

	// Split the lyrics into words and check if each word is a country
	const words = normalizedLyrics.split(/\W+/);
	words.forEach((word) => {
		if (countryHash[word] && !foundCountries.includes(word)) {
			foundCountries.push(word);
		}
	});

	return foundCountries;
};

module.exports = { extractCountries };
