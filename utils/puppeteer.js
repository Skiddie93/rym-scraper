import puppeteer from "puppeteer";
import { promises as fs } from "fs";

//const fs = require("fs");

const scraper = async (year, page, mode) => {
  await page.evaluate(async () => {
    const button = document.querySelector(".fc-cta-consent");
    button?.click();
  });

  await page.evaluate(async (_) => {
    function scrollToBottom(timedelay = 0, resolve) {
      console.log(`scrolling \n`);
      var scrollId;
      var height = 0;
      var minScrollHeight = 100;
      scrollId = setInterval(function () {
        if (height <= document.body.scrollHeight) {
          window.scrollBy(0, minScrollHeight);
        } else {
          clearInterval(scrollId);
          console.log(`Scroll finished \n`);
          resolve("done");
        }
        height += minScrollHeight;
      }, timedelay);
    }

    const scrollPromise = new Promise((resolve) => {
      scrollToBottom(100, resolve);
    });

    await scrollPromise;
  });

  const albumData = await page.evaluate(async () => {
    const albums = Array.from(
      document.querySelectorAll("[id^='page_charts_section_charts_item']")
    );

    const data = albums.map((item) => {
      const spotify = item.querySelector(".ui_media_link_btn_spotify");
      const name = item.querySelector(".ui_name_locale_original").innerHTML;
      const artist = item.querySelector(".ui_name_locale_original").innerHTML;

      const spotifySplit = spotify?.getAttribute("href").split("/");

      const spotifyId = spotifySplit
        ? spotifySplit[spotifySplit.length - 1]
        : null;

      return {
        album: name,
        artist: artist,
        spotifyId: spotifyId,
      };
    });

    const filteredData = data.filter((item) => item.spotifyId);

    return filteredData;
  });

  fs.writeFile(`./data/${mode}/${year}.json`, JSON.stringify(albumData), (err) => {
    err
      ? console.log(err)
      : console.log(`File written successfully for ${year}\n`);
  });
  console.log(`File written successfully for ${year}\n`);
  console.log(`Waiting a minute\n`);
  // Close browser.
  const wait = new Promise((resolve) => {
    setTimeout(() => resolve("done"), 30000);
  });
  await wait;
};

export const getYears = async (from, to) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let i = from; i <= to; ++i) {
    const url = `https://rateyourmusic.com/charts/top/album/${i}/`;

    // Go to your site
    await page.goto(url);
    await scraper(i.toString(), page,"years");
  }

  browser.close();
};

export const getGenres = async () => {
  const genres = [
    "ambient",
    "blues",
    "classical-music",
    "country",
    "dance",
    "electronic",
    "experimental",
    "folk",
    "hip-hop",
    "industrial-and-noise",
    "jazz",
    "metal",
    "musical-theatre-and-entertainment",
    "new-age",
    "pop",
    "psychedelia",
    "punk",
    "randb",
    "regional-music",
    "rock",
    "singer-songwriter",
    "spoken-word",
    "ambient-pop",
    "asmr",
    "beatboxing",
    "bugle-call",
    "comedy",
    "dark-cabaret",
    "darkwave",
    "easy-listening",
    "field-recordings",
    "gospel",
    "hanmai",
    "mantra",
    "marching-band",
    "mashup",
    "mechanical-music",
    "shibuya-kei",
    "ska",
    "sound-effects",
    "visual-kei",
    "ytpmv",
  ];

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (const genre of genres) {
    const url = `https://rateyourmusic.com/charts/top/album/all-time/g:${genre}/`;

    // Go to your site
    await page.goto(url);
    await scraper(genre, page, "genres");
  }

  browser.close();
};
