const fs = require("fs");

let data = [];
let i = 0;
while (i < 10) {
  i++;
  data = JSON.parse(
    fs.readFileSync(`./movies_tvshows_db${i === 10 ? "10" : `0${i}`}.json`)
  );

  console.log(`File ${i === 10 ? "10" : `0${i}`}: ${data.length}`);
}

data = JSON.parse(fs.readFileSync(`./movies_tvshows_db_final.json`));
console.log(`Total: ${data.length}`);
