import express from "express";
import { promises as fs } from "fs";

const years = express.Router();

years.get(`/`, async (req, res) => {
  const baseURL = req.protocol + "://" + req.get("host") + req.originalUrl;
  const yearsData = [];

  for (let i = 1945; i <= 2024; i++) {
    yearsData.push({
      name: i.toString(),
      url: `${baseURL}${i}`,
    });
  }

  res.json(yearsData);
});

years.get(`/:id`, async (req, res) => {
  try {
    const data = await fs.readFile(
      `./data/years/${req.params.id}.json`,
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

export default years;
