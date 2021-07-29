import { useState, useEffect } from "react";
import DisplayedList from "./DisplayedList";
import axios from "axios";
import "./Media.scss";
import { getGenreNameFromId } from "../utils/getGenre";

const Movies = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(
    "action-and-adventure"
  );
  const [tvShowsList, setTVShowsList] = useState([]);

  const fetchDataFor = (category, page) => {
    axios
      .get(`http://rec76.pythonanywhere.com/tv/${category}/page/${page}`)
      .then((res) => {
        if (!res.data.length) {
          alert("No more pages to load");
        } else {
          res.data.forEach((tvShows) => {
            tvShows.genre_ids = tvShows.genre_ids.map((id) =>
              getGenreNameFromId(id)
            );
          });
          setTVShowsList(res.data);
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
          className={
            selectedCategory === "action-and-adventure" ? "selected" : ""
          }
          onClick={() => handleCategoryChange("action-and-adventure")}
        >
          ACTION & ADVENTURE
        </li>
        <li
          className={selectedCategory === "crime" ? "selected" : ""}
          onClick={() => handleCategoryChange("crime")}
        >
          CRIME
        </li>
        <li
          className={selectedCategory === "drama" ? "selected" : ""}
          onClick={() => handleCategoryChange("drama")}
        >
          DRAMA
        </li>
        <li
          className={
            selectedCategory === "sci-fi-and-fantasy" ? "selected" : ""
          }
          onClick={() => handleCategoryChange("sci-fi-and-fantasy")}
        >
          SCI-FI & FANTASY
        </li>
        <li
          className={selectedCategory === "family" ? "selected" : ""}
          onClick={() => handleCategoryChange("family")}
        >
          FAMILY
        </li>
      </ul>
      <hr />

      <DisplayedList media={tvShowsList} />

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
          className={tvShowsList.length < 12 ? "disabled-btn" : ""}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Movies;
