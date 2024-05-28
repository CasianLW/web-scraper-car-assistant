const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url =
  "https://www.automobile.fr/voiture/audi-a3/vhc:car,pgn:1,pgs:10,srt:price,sro:asc,ms1:1900_8_,frn:2017,prn:10000,prx:55000,mlx:200000,dmg:false";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
};

axios
  .get(url, { headers })
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const cars = [];

    $(".list-entry").each((index, element) => {
      const title = $(element).find(".vehicle-title").first().text().trim();
      const price = $(element).find(".seller-currency").first().text().trim();
      const details = $(element)
        .find(".vehicle-information p")
        .map((i, el) => $(el).text().trim())
        .get()
        .join(", ");
      const location = $(element).find(".mde-icon-flag").parent().text().trim();
      const imgSrc = $(element).find("img.img-lazy").attr("src");
      const href = $(element).find("a.vehicle-data").attr("href");

      const fullImgSrc = imgSrc ? `https://img.classistatic.de${imgSrc}` : null;
      const fullHref = href ? `https://www.automobile.fr${href}` : null;

      cars.push({
        title,
        price,
        details,
        location,
        imgSrc: fullImgSrc,
        href: fullHref,
      });
    });

    fs.writeFileSync(
      "data/cars-scraped.json",
      JSON.stringify(cars, null, 2),
      "utf-8"
    );
    console.log("Data has been written to carsScrapped.json");
  })
  .catch((error) => {
    console.error(`There was an error fetching the data: ${error}`);
  });
