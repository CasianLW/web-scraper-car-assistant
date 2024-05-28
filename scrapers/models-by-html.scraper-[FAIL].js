const puppeteer = require("puppeteer");
const fs = require("fs");

const baseUrl =
  "https://www.automobile.fr/recherche-d%C3%A9taill%C3%A9e/vhc:car/pg:dspcar";

async function scrapeMakesAndModels() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  console.log("Page loaded. Logging HTML content...");

  // uncomment to debugg page content
  // const pageContent = await page.content();
  // fs.writeFileSync("pageContent.html", pageContent);
  // console.log("HTML content logged to page-content.html");

  console.log("Waiting for make dropdown to be available...");
  try {
    // Wait for the make dropdown to be available
    await page.waitForSelector("#makeModelVariant1Make", {
      visible: true,
      timeout: 30000,
    });
  } catch (error) {
    console.error("Error: Make dropdown not found.");
    await browser.close();
    return {};
  }

  console.log("Make dropdown is available. Scraping makes...");

  // Get all make IDs and names
  const makes = await page.evaluate(() => {
    const makeOptions = Array.from(
      document.querySelectorAll("#makeModelVariant1Make option")
    );
    const makes = {};
    makeOptions.forEach((option) => {
      const makeId = option.value;
      const makeName = option.textContent.trim();
      if (makeId && makeName && makeId !== "") {
        makes[makeId] = {
          makeCode: makeId,
          title: makeName,
          modelCodes: {},
        };
      }
    });
    return makes;
  });

  console.log("Makes scraped:", makes);

  // For each make, select it and get corresponding models
  for (const makeId of Object.keys(makes)) {
    console.log(`Scraping models for make ID: ${makeId}`);

    await page.select("#makeModelVariant1Make", makeId);
    console.log(`Selected make ID: ${makeId}`);

    // Wait for the model dropdown to update
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Ensure model dropdown is updated
    try {
      await page.waitForSelector("#makeModelVariant1Model option", {
        visible: true,
        timeout: 30000,
      });
    } catch (error) {
      console.error(`Error: Model dropdown not found for make ID: ${makeId}`);
      continue;
    }

    const models = await page.evaluate(() => {
      const modelOptions = Array.from(
        document.querySelectorAll("#makeModelVariant1Model option")
      );
      const models = {};
      modelOptions.forEach((option) => {
        const modelId = option.value;
        const modelName = option.textContent.trim();
        if (modelId && modelName && modelId !== "") {
          models[modelId] = modelName;
        }
      });
      return models;
    });

    console.log(`Found models for make ID ${makeId}:`, models);
    makes[makeId].modelCodes = models;

    // Add a random delay between requests to avoid rate limiting
    const delay = Math.floor(Math.random() * (150 - 50 + 1) + 50);
    console.log(`Waiting for ${delay} ms before next request...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  await browser.close();
  return makes;
}

async function main() {
  console.log("Starting scraper...");
  const makesAndModels = await scrapeMakesAndModels();
  fs.writeFileSync(
    "makesAndModels.json",
    JSON.stringify(makesAndModels, null, 2)
  );
  console.log("Scraping completed. Data saved to makesAndModels.json");
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
