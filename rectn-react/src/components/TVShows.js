import { useState, useEffect } from "react";
import DisplayedList from "./DisplayedList";
import axios from "axios";
import "./Media.scss";
import { getGenreNameFromId } from "../utils/getGenre";

const TVShows = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("recommended");
  const [tvShowsList, setTVShowsList] = useState([]);

  const fetchDataFor = (category, page) => {
    axios
      .get(`http://rec76.pythonanywhere.com/tv/${category}/page/${page}`)
      .then((res) => {
        res.data.forEach((tvShows) => {
          tvShows.genre_ids = tvShows.genre_ids.map((id) =>
            getGenreNameFromId(id)
          );
        });
        setTVShowsList(res.data);
        setPage(page);
      });
  };

  useEffect(() => {
    fetchDataFor(selectedCategory, 1);
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setPage(1);
    setSelectedCategory(category);
  };

  const handlePrevPage = () => {
    if (page !== 1) {
      fetchDataFor(selectedCategory, page - 1);
    }
  };

  const handleNextPage = () => {
    fetchDataFor(selectedCategory, page + 1);
  };

  return (
    <section className="media" id="tvshows">
      <h2>TV Shows</h2>
      <ul>
        <li
          className={selectedCategory === "recommended" ? "selected" : ""}
          onClick={() => handleCategoryChange("recommended")}
        >
          RECOMMENDED
        </li>
        <li
          className={selectedCategory === "top-rated" ? "selected" : ""}
          onClick={() => handleCategoryChange("top-rated")}
        >
          TOP RATED
        </li>
        <li
          className={selectedCategory === "new-releases" ? "selected" : ""}
          onClick={() => handleCategoryChange("new-releases")}
        >
          NEW RELEASES
        </li>
      </ul>
      <hr />

      <DisplayedList media={tvShowsList} />

      <div className="pagination without-bottom-padding">
        <button
          onClick={handlePrevPage}
          className={page === 1 ? "disabled-btn" : ""}
        >
          Prev.
        </button>
        <button className="txt">Page {page}</button>
        <button
          onClick={handleNextPage}
          className={tvShowsList.length < 12 ? "disabled-btn" : ""}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default TVShows;
