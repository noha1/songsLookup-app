require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
const MUSIXMATCH_API_KEY = process.env.MUSIXMATCH_API_KEY;
