import { useState, useEffect } from "react";
import DisplayedList from "./DisplayedList";
import axios from "axios";
import "./Media.scss";
import { getGenreNameFromId } from "../utils/getGenre";

const Movies = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("action");
  const [moviesList, setMoviesList] = useState([]);

  const fetchDataFor = (category, page) => {
    axios
      .get(`http://rec76.pythonanywhere.com/movie/${category}/page/${page}`)
      .then((res) => {
        if (!res.data.length) {
          alert("No more pages to load");
        } else {
          res.data.forEach((tvShows) => {
            tvShows.genre_ids = tvShows.genre_ids.map((id) =>
              getGenreNameFromId(id)
            );
          });
          setMoviesList(res.data);
          setPage(page);
        }
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
    <section className="media">
      <ul>
        <li
          className={selectedCategory === "action" ? "selected" : ""}
          onClick={() => handleCategoryChange("action")}
        >
          ACTION
        </li>
        <li
          className={selectedCategory === "drama" ? "selected" : ""}
          onClick={() => handleCategoryChange("drama")}
        >
          DRAMA
        </li>
        <li
          className={selectedCategory === "horror" ? "selected" : ""}
          onClick={() => handleCategoryChange("horror")}
        >
          HORROR
        </li>
        <li
          className={selectedCategory === "comedy" ? "selected" : ""}
          onClick={() => handleCategoryChange("comedy")}
        >
          COMEDY
        </li>
        <li
          className={selectedCategory === "family" ? "selected" : ""}
          onClick={() => handleCategoryChange("family")}
        >
          FAMILY
        </li>
      </ul>
      <hr />

      <DisplayedList media={moviesList} />

      <div className="pagination">
        <button
          onClick={handlePrevPage}
          className={page === 1 ? "disabled-btn" : ""}
        >
          Prev.
        </button>
        <button className="txt">Page {page}</button>
        <button
          onClick={handleNextPage}
          className={moviesList.length < 12 ? "disabled-btn" : ""}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Movies;
