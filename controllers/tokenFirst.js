const https = require("https");
const fs = require("fs");
require("dotenv").config({ path: "../config/config.env" }); // Load environment variables from .env file

const apiEndpoint = "https://api.boclips.com/v1/videos";
const pageSize = 10; // Number of videos to retrieve per page
const page = 1; // The page number of videos to retrieve
const sort = "createdAt,desc"; // Sort videos by creation date in descending order
const videoFields = "id,title,description,duration"; // The fields to retrieve for each video

const outputFilePath = "../responses/list.json";

const getVideos = () => {
  const accessToken = process.env.ACCESS_TOKEN;

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const queryParams = `pageSize=${pageSize}&page=${page}&sort=${sort}&fields=${videoFields}`;

  https
    .get(`${apiEndpoint}?${queryParams}`, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
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
    })
    .on("error", (err) => {
      console.error(`Error retrieving video: ${err.message}`);
    });
};

const middleware = (req, res, next) => {
  require("./accessTokenRequest")((err) => {
    if (err) {
      console.error(`Error retrieving access token: ${err.message}`);
      res.status(500).send("Internal server error");
    } else {
      next();
    }
  });
};

module.exports = { middleware, getVideos };
