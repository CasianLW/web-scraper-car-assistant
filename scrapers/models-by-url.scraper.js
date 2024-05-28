const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const baseUrl = "https://www.automobile.fr/voiture/vhc:car,ms1:";
const startCode = 0;
const endCode = 100000;
const validCodes = [];
const makes = {};

function getRandomDelay(min = 50, max = 150) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function checkCode(code) {
  const url = `${baseUrl}${code}`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  };

  try {
    const response = await axios.get(url, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    const make = $(".h3.u-text-bold").first().text().trim();
    const model = $(".vehicle-title").first().text().trim();

    if (make && !model) {
      if (!makes[make]) {
        makes[make] = {
          makeCode: code,
          title: make,
          modelCodes: {},
        };
      }
    } else if (model) {
      const makeKey = Object.keys(makes).find((key) => model.includes(key));

      if (makeKey) {
        makes[makeKey].modelCodes[code] = model;
      }
    }

    console.log(`Checked code: ${code}`);
  } catch (error) {
    // Handle errors (e.g., non-existent code)
  }
}

async function main() {
  for (let code = startCode; code <= endCode; code++) {
    await checkCode(code);
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
  }

  fs.writeFileSync("data/valid-codes.json", JSON.stringify(makes, null, 2));
  console.log("Scrapping completed. Valid codes saved to validCodes.json");
}

main();
