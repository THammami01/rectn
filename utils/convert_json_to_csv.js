// require json-2-csv module
const converter = require("json-2-csv");
const fs = require("fs");

// read JSON from a file
const data = JSON.parse(fs.readFileSync("movies_tvshows_db_rec.json"));

// convert JSON array to CSV string
(async () => {
  try {
    const csv = await converter.json2csvAsync(data);

    // write CSV to a file
    fs.writeFileSync("movies_tvshows_db_final.csv", csv);
  } catch (err) {
    console.log(err);
  }
})();
