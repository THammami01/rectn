// 10k users, ids range [1, 10000]
const fs = require("fs");
let data = JSON.parse(fs.readFileSync("./movies_tvshows_db_final.json"));
data = data.map(
  ({ id: mediaId, vote_average: voteAverage, vote_count: voteCount }) => ({ mediaId, voteAverage, voteCount })
);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRatings = (mediaId, voteCount) => {
  let i = 0;
  const mediaRatings = ["user_id, item_id, rating"];
  while (i < voteCount) {
    mediaRatings.push(
      // TODO: each user must rate a movie/tv show only once
      `${getRandomInt(1, 10000)},${mediaId},${getRandomInt(0, 5)}`
    );
    i++;
  }
  return mediaRatings.join("\r\n");
};

const totalMediasRatings = [];
data.forEach(({ mediaId, voteCount }) => {
  totalMediasRatings.push(getRatings(mediaId, voteCount));
});

fs.writeFile(
  "fake_users_ratings.csv",
  totalMediasRatings.join("\r\n"),

  "utf8",
  (err) => {
    if (err) console.log("An error occured while writing JSON Object to File.");
    else console.log("JSON file has been saved successfully.");
  }
)
