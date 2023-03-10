const https = require("https");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const options = {
  hostname: "api.boclips.com",
  path: "/v1/token",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const data = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    const token = JSON.parse(data).access_token;
    console.log(token);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
