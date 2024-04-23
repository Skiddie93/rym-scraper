import { getYears, getGenres } from "./utils/puppeteer.js";
import { loopYears, loopGenres } from "./utils/makeYearCharts.js";

(async function init(from = 2015, to = 2024) {
  //await getYears(from, to);
  await loopYears(from, to);

  //await getGenres();
  //await loopGenres();
})();
