import express from "express";
import { promises as fs } from "fs";

const genres = express.Router();

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
