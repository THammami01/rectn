import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { getGenreNameFromId } from "../utils/getGenre";
import { AppContext } from "../App";
import "./page.scss";

const Favorites = () => {
  const [favoriteMedias, setFavoriteMedias] = useState([]);
  const { mainData } = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) history.push("/login");
    document.title = "REC TN ‣ Favorites";

    axios
      .post(`/favorites`, {
        accessToken: mainData.accessToken,
      })
      .then((res) => {
        axios
          .post(`http://rec76.pythonanywhere.com/medias-from-ids`, res.data)
          .then((res) => {
            setFavoriteMedias(res.data);
          });
      });
  }, []);

  return (
    <div className="container">
      <h1>
        {" "}
        <Link to="/profile" className="go-back">
          <img src="/assets/imgs/previous.png" alt="Go To Profile" />
        </Link>
        Favorite Movies and TV Shows
      </h1>

      <div className="similar-medias some-px">
        {favoriteMedias.length === 0 && "Nothing is saved yet."}
        {favoriteMedias?.map((media) => (
          <Link
            className="single-similar-media"
            key={media.id}
            to={`/media/${media.id}`}
          >
            <img
              src={"http://image.tmdb.org/t/p/w500" + media.backdrop_path}
              alt="Poster"
            />
            <div className="img_paragraphs">
              <p>
                {media?.original_title}
                {media?.name}
                {media?.release_date && ` (${media.release_date.substr(0, 4)})`}
                {media?.first_air_date &&
                  ` (${media.first_air_date.substr(0, 4)})`}
              </p>
              <p>
                {media?.genre_ids
                  ?.map((genreId) => getGenreNameFromId(genreId))
                  .join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
