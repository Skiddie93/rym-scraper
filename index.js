import { getYears, getGenres } from "./utils/puppeteer.js"
import { loopYears, loopGenres } from "./utils/makeYearCharts.js"

async function init(from, to) {
  await getYears(from, to);
  await loopYears(from, to);

  wait getGenres();
  await loopGenres();
}

init(2023, 2024);
