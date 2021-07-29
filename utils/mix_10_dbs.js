const fs = require("fs");

let finalDB = [];
for (let i = 1; i <= 10; i++) {
  let data = JSON.parse(
    fs.readFileSync(`./movies_tvshows_db${i === 10 ? "10" : `0${i}`}.json`)
  );

  data = data.map(({ id: item_id }) => ({
    item_id,
  }));
  finalDB = [...finalDB, ...data];
}

fs.writeFile(
  "movies_tvshows_db_rec.json",
  JSON.stringify(finalDB),

  "utf8",
  (err) => {
    if (err) console.log("An error occured while writing JSON Object to File.");
    else console.log("JSON file has been saved successfully.");
  }
);
