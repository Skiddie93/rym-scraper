import express from "express";
import years from "./routes/years.js";
import genres from "./routes/genres.js";

const app = express();
const port = 5151;

app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use("/charts/years/", years);
app.use("/charts/genres/", genres);
