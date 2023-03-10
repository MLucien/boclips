require("dotenv").config({path: "../config/config.env"}); // Load environment variables from .env file
const https = require("https");
const querystring = require("querystring");
const fs = require("fs");

const apiEndpoint = "https://api.boclips.com/v1/token";
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const authData = querystring.stringify({
  grant_type: "client_credentials",
  client_id: clientId,
  client_secret: clientSecret,
});

const authOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const accessTokenRequest = https.request(
  `${apiEndpoint}`,
  authOptions,
  (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      const response = JSON.parse(data);

      if (response.access_token) {
        process.env.ACCESS_TOKEN = response.access_token; // Set access token as environment variable

        // Write the access token to the .env file
        fs.appendFile("../config/config.env", `\nACCESS_TOKEN=${response.access_token}`, (err) => {
          if (err) {
            console.error(`Error writing to .env file: ${err.message}`);
          } else {
            console.log(`Access token saved to .env file`);
          }
        });
      } else {
        console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);
        console.log(`CLIENT_SECRET: ${process.env.CLIENT_SECRET}`);

        console.error(`Error obtaining access token: ${response.error}`);
      }
    });
  }
);

accessTokenRequest.write(authData);
accessTokenRequest.end();

module.exports = accessTokenRequest;