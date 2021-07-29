const fs = require("fs");
const axios = require("axios");

const apiKey = "381fb0d5ed48be5789e68cfb262bd720";
let mediaList = [];
let page = 0;

const fetchAPI = async () => {
  // 1000 pages to fetch
  while (page < 200) {
    page++;

    await axios
      .get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=en-US&page=${page}`
      )
      .then((response) => {
        mediaList = [...mediaList, ...response.data.results];
      })
      .catch((err) => {
        console.error(err);
      });
      console.log(mediaList.length)

    console.log(`Page ${page}.`);
  }

  fs.writeFile(
    "movies_tvshows_db.json",
    JSON.stringify(mediaList),

    "utf8",
    (err) => {
      if (err)
        console.log("An error occured while writing JSON Object to File.");
      else console.log("JSON file has been saved successfully.");
    }
  );
};

fetchAPI();
