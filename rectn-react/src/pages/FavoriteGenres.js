import { useState, useContext, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";

import { getGenreNameFromId, getAllGenresIds } from "../utils/getGenre";
import "./page.scss";

const FavoriteGenres = () => {
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const { mainData } = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) history.push("/login");
    document.title = "REC TN ‣ Favorite Genres"
  }, [])
  
  useEffect(() => {
    axios
      .post("/favorite-genres", {
        accessToken: mainData.accessToken,
      })
      .then((res) => {
        setFavoriteGenres(res.data);
      })
      .catch((err) => {
        // alert("Couldn't fetch favorite genres..");
      });
  }, [mainData]);

  const handleFavoriteGenreToggle = (id) => {
    axios
      .post("/favorite-genres/toggle", {
        genreId: id,
        accessToken: mainData.accessToken,
      })
      .then((res) => {
        setFavoriteGenres(res.data);
      })
      .catch((err) => {
        // alert("Couldn't fetch favorite genres..");
      });
  };

  return (
    <div className="container">
      <h1>
        <Link to="/profile" className="go-back">
          <img src="/assets/imgs/previous.png" alt="Go To Profile" />
        </Link>
        Favorite Genres
      </h1>
      <div className="content">
        {getAllGenresIds.map((id) => (
          <div className="genre-item" key={id}>
            <div onClick={() => handleFavoriteGenreToggle(id)}>
              {favoriteGenres?.includes(id) ? (
                <FaHeart className="icon" />
              ) : (
                <FaRegHeart className="icon" />
              )}{" "}
              {getGenreNameFromId(id)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteGenres;
