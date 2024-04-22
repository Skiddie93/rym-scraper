import express from "express";
import years from "./routes/years.js";
import genres from "./routes/genres.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/charts/years/", years);
app.use("/charts/genres/", genres);
