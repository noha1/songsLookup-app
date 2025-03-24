const { extractCountries } = require("../utils/helpers");

describe("extractCountries", () => {
	it("should correctly identify countries in lyrics , case senstive and no redundancy", () => {
		const lyrics =
			"I love pasta and i go to Italy . I eat lots but I visited UK and France , france last year.";
		const expectedCountries = ["italy", "uk", "france"];

		const result = extractCountries(lyrics);

		expect(result).toEqual(expect.arrayContaining(expectedCountries));
	});

	it("should handle cases where no countries are mentioned", () => {
		const lyrics = "This song is about love and peace. and got no countries";
		const result = extractCountries(lyrics);

		expect(result).toEqual([]);
	});

	it("should return an empty array for lyrics with no recognized countries", () => {
		const lyrics = "Some random song with no countries mentioned";
		const result = extractCountries(lyrics);

		expect(result).toEqual([]); // No countries should be found
	});
});
