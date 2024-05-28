const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const baseUrl =
  "https://www.automobile.fr/recherche-d%C3%A9taill%C3%A9e/vhc:car/pg:dspcar";
const makeUrlTemplate =
  "https://www.automobile.fr/voiture/{makeName}/vhc:car,ms1:{makeId}__";

async function fetchHtml(url) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  };

  const response = await axios.get(url, { headers });
  return response.data;
}

async function scrapeMakes() {
  const html = await fetchHtml(baseUrl);
  const $ = cheerio.load(html);

  const makes = {};
  $("#makeModelVariant1Make option").each((index, element) => {
    const makeId = $(element).attr("value");
    const makeName = $(element).text().trim();
    if (makeId && makeName && makeId !== "") {
      makes[makeId] = {
        makeCode: makeId,
        title: makeName,
        modelCodes: {},
      };
    }
  });

  return makes;
}

async function scrapeModels(makeName, makeId) {
  const url = makeUrlTemplate
    .replace("{makeName}", makeName)
    .replace("{makeId}", makeId);
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const models = {};
  $("#makeModelVariant1Model option").each((index, element) => {
    const modelId = $(element).attr("value");
    const modelName = $(element).text().trim();
    if (modelId && modelName && modelId !== "") {
      models[modelId] = modelName;
    }
  });

  return models;
}

async function main() {
  console.log("Starting scraper...");
  const makes = await scrapeMakes();
  console.log("Makes scraped:", makes);

  for (const makeId of Object.keys(makes)) {
    const makeName = makes[makeId].title;
    console.log(`Scraping models for make: ${makeName} (ID: ${makeId})`);
    makes[makeId].modelCodes = await scrapeModels(
      makeName.toLowerCase(),
      makeId
    );

    // Add a random delay between requests to avoid rate limiting
    const delay = Math.floor(Math.random() * (150 - 50 + 1) + 50);
    console.log(`Waiting for ${delay} ms before next request...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  fs.writeFileSync(
    "data/makes-and-models.json",
    JSON.stringify(makes, null, 2)
  );
  console.log("Scraping completed. Data saved to makesAndModels.json");
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
