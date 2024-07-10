# Web Scraper for Automobile Makes and Models

![gif](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHJsaGd2bXF2dmpyNnVtamtuMzZobHQwN2E5cW83dDRncTYwb2RucyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xI4s15RPyDxNpRCdhx/giphy.gif)

## Project Overview

This project is a web scraper designed to extract automobile makes and models from the automobile.fr website. The project utilizes both Puppeteer and Cheerio to scrape data from the website, allowing for flexible and robust data extraction.

### Key Features

- **Scraping Makes and Models:** The primary functionality is to scrape all available car makes and their respective models from the automobile.fr website.
- **Two Approaches:**
  - **Puppeteer:** For dynamic interaction and scraping.(tests)
  - **Cheerio:** For static HTML parsing and scraping.(tests)
- **Data Storage:** Scraped data is saved in JSON format for easy access and manipulation.

### Detailed Description of Files

#### Data

- **cars-scraped.json:** Stores the scraped car details (array of cars on a search page).
- **makes-and-models.json:** The current version of the makes and models data. (for filters)

#### Scrapers

- **main.scraper.js:** The main scraper, scraping the ads on a search;
- **models-by-html.scraper-[FAIL].js:** An attempt to scrape using Pupeeter which did not yield the expected results.
- **models-by-url.scraper.js:** The current working scraper using Cheerio to scrape makes and models.

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd web-scraper-car-assistant
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Usage

#### Running the Scraper

To run the scraper, use the following command:

This will scrape ads of a search page:

```bash
node scrapers/main.scraper.js
```

<br>
This will scrape the makes and models and save the data in `makesAndModels.json` in the `data` directory:

```bash
node scrapers/models-by-url.scraper.js
```

### Project Details

#### Puppeteer

Puppeteer is used for dynamic scraping. It is particularly useful when dealing with websites that require interaction, such as clicking buttons or filling out forms.

#### Cheerio

Cheerio is used for static HTML parsing. It is faster and more lightweight compared to Puppeteer but is only effective for websites where JavaScript execution is not required to render content.

### Contributions

Contributions are welcome! Please fork the repository and create a pull request with your changes.

### License

This project is licensed under the MIT License.

### Contact

casian.fr
