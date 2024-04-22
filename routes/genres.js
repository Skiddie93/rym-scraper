import express from "express";
import { promises as fs } from "fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const genresLists = require("../src/genre-list/genres.json");

console.log(genresLists);

const genres = express.Router();

genres.get(`/`, async (req, res) => {
  const baseURL = req.protocol + "://" + req.get("host") + req.originalUrl;
  const genresData = genresLists.map((item) => {
    return {
      name: item,
      url: `${baseURL}${item}`,
    };
  });

  res.json(genresData);
});

genres.get(`/:id`, async (req, res) => {
  try {
    const data = await fs.readFile(
      `./data/genres/${req.params.id}.json`,
      "utf8",
      (err, data) => {
        return data;
      }
    );

    const chart = JSON.parse(data);
    res.json(chart);
  } catch (err) {
    res.json({
      error: { error: err, message: "Error while requesting ressource" },
    });
  }
});

export default genres;
