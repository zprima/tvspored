const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");

const interestingPrograms = [
  "History%202%20HD",
  "Kanal%20A%20HD",
  "Kino%20HD",
  "POP%20HD",
  "National%20Geographic",
  "SciFi",
  "SLO%202",
  "Animal%20Planet%20HD"
];

const date = new Date();

function convertToTimeWithHour(hour) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDay(),
    hour,
    "00"
  ).getTime();
}

const startingTime = convertToTimeWithHour(17);
const closingTime = convertToTimeWithHour(21);

function displayTimeProgram($, elem) {
  const time = $(elem)
    .find(".time")
    .text();
  const prog = $(elem)
    .find(".prog")
    .text();

  if (time.length === 0) {
    return;
  }

  const progTime = convertToTimeWithHour(time.split(":")[0]);

  if (progTime >= startingTime && progTime <= closingTime) {
    const t = prog.includes("Judo") ? chalk.green(prog) : prog;
    console.log(`${time} ${t}`);
  }
}

async function main() {
  interestingPrograms.map(async program => {
    const url = encodeURI(`http://www.tvsporedi.si/spored.php?id=${program}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const programTitle = $(
      "#content > div.right_three > div:nth-child(1)"
    ).text();
    console.log("-----");
    console.log(programTitle);

    $("#a > .schedule div").each((_, elem) => {
      displayTimeProgram($, elem);
    });
  });
}

main();
