const axios = require("axios");
const cheerio = require("cheerio");

const interestingPrograms = ["slo2", "akanal", "poptv", "brio"];

const date = new Date();
const time = new Date(
  date.getUTCFullYear(),
  date.getUTCMonth(),
  date.getUTCDay(),
  "17",
  "00"
);

async function main() {
  interestingPrograms.map(async function(program) {
    const url = `https://tv-spored.siol.net/kanal/${program}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const programTitle = $(".section .wrapper .table-list-header h2").text();
    console.log("-----");
    console.log(programTitle);

    const entries = [];
    $(".section .table-list-rows .row").map(function(_, elem) {
      const st = $(this)
        .find(".col-1")
        .text();
      const stc = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDay(),
        st.split(":")[0],
        st.split(":")[1]
      );

      if (stc.getTime() >= time.getTime()) {
        entries.push({
          startTime: st,
          title: $(this)
            .find(".col-9")
            .text()
            .trim(),
          category: $(this)
            .find(".gray")
            .text()
        });
      }
    });

    entries.forEach(function(item) {
      console.log(`${item.startTime} ${item.title}`);
    });
  });
}

main();
