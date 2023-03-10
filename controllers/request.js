const https = require("https");
const fs = require("fs");
require("dotenv").config({path: "../config/config.env"}); // Load environment variables from .env file


const videoId = '629f10666fa9f91242578998';
const accessToken = process.env.ACCESS_TOKEN;
const outputFilePath = "../responses/video.json";
//const accessToken = process.env.ACCESS_TOKEN;


const options = {
  hostname: "api.boclips.com",
  path: `/v1/videos/${videoId}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json" //

  },
};

https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        if (data) {
          const video = JSON.parse(data);
          fs.writeFile(outputFilePath, JSON.stringify(video), (err) => {
            if (err) {
              console.error(`Error writing file: ${err.message}`);
            } else {
              console.log(`Video data saved to ${outputFilePath}`);
            }
          });
        } else {
          console.error(`Empty response received from server`);
        }
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`);
      }
    });
  }).on('error', (err) => {
    console.error(`Error retrieving video: ${err.message}`);
  });