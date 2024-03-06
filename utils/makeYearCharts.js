import { getToken, getAlbumBatch } from "./getToken.js";
import { promises as fs } from "fs";

let token;

const getChartFile = async (files, mode) => {
  const data = await fs.readFile(
    `./data/${mode}/${files}.json`,
    "utf8",
    (err, data) => {
      if (err) throw err;
      return data;
    }
  );

  const chart = JSON.parse(data);
  return chart;
};

const createYearFile = async (file, mode) => {
  const yearChart = await getChartFile(file, mode);
  const chartIds = yearChart.map((item) => item.spotifyId);

  const maxChunkLength = 20;

  // spotify api allows up to 20 ids in one call
  const chunk = (ids, step) => {
    const [...idArray] = ids;

    const end = maxChunkLength * step;
    const start = end - maxChunkLength;
    const idChunk = idArray.slice(start, end);

    const chunkParamString = idChunk.join(",");
    const param = encodeURIComponent(chunkParamString);

    return param;
  };

  let allAlbums = [];

  for (let i = 1; i <= Math.ceil(chartIds.length / maxChunkLength); ++i) {
    const ids = chunk(chartIds, i);
    let albumData = await getAlbumBatch(token, ids);

    if (albumData.error) {
      //TODO: get correct error message to handle expiration case
      console.log("!!!ERROR!!!", albumData);
      const newToken = await getToken();
      albumData = await getAlbumBatch(newToken, ids);
    }
  
    allAlbums = [...allAlbums, ...albumData];
  }

  await fs.writeFile(
    `./data/charts-${mode}/${file}.json`,
    JSON.stringify(allAlbums),
    (err) => {
      if (err) console.log(err);
    }
  );

  console.log(`File written successfully for ${file}\n`);

  const wait = new Promise((resolve) => {
    setTimeout(() => resolve("done"), 30000);
  });
  // pause between calls to prevent too many concurent requests
  await wait;
};

export const loopYears = async (from, to) => {
  token = await getToken();

  for (let index = from; index <= to; index++) {
    await createYearFile(index.toString(), "years");
  }
};

export const loopGenres = async () => {
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
  token = await getToken();

  for (const genre of genres) {
    await createYearFile(genre, "genres");
  }
};
