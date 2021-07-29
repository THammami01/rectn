import { useEffect, useState, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { getGenreNameFromId } from "../utils/getGenre";
import { getReadableDate } from "../utils/getDate.js";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { DualRing } from "react-spinners-css";
import { AppContext } from "../App";
import "./page.scss";

const SingleMedia = () => {
  const [singleMedia, setSingleMedia] = useState({});
  const [similarMedias, setSimilarMedias] = useState([]);
  const [isHearted, setHearted] = useState(false);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const { mainData } = useContext(AppContext);
  const { mediaId } = useParams();
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://rec76.pythonanywhere.com/media/${mediaId}`).then((res) => {
      axios
        .post("/favorites/check", {
          mediaId,
          accessToken: mainData.accessToken,
        })
        .then((res) => {
          setHearted(res.data.isHearted);
        })
        .catch((err) => {});

      setSingleMedia(res.data);
    });

    axios.get(`http://rec76.pythonanywhere.com/similar-medias/${mediaId}`).then((res) => {
      setSimilarMedias(res.data);
    });

    axios
      .post("/favorite-genres", {
        accessToken: mainData.accessToken,
      })
      .then((res) => {
        setFavoriteGenres(res.data);
        console.log(favoriteGenres);
      })
      .catch((err) => {
        // alert("Couldn't fetch favorite genres..");
      });
  }, []);

  useEffect(() => {
    if (singleMedia?.original_title)
      document.title = `REC TN ‣ ${singleMedia.original_title}`;
    if (singleMedia?.name) document.title = `REC TN ‣ ${singleMedia.name}`;
  }, [singleMedia]);

  const handleSingleSimilarMediaClick = (mediaId) => {
    setSimilarMedias([]);

    axios.get(`http://rec76.pythonanywhere.com/media/${mediaId}`).then((res) => {
      history.push(`/media/${mediaId}`);
      setSingleMedia(res.data);

      axios
        .post("/favorites/check", {
          mediaId,
          accessToken: mainData.accessToken,
        })
        .then((res) => {
          setHearted(res.data.isHearted);
        })
        .catch((err) => {
          // alert("Couldn't fetch favorite genres..");
        });

      axios
        .get(`http://rec76.pythonanywhere.com/similar-medias/${mediaId}`)
        .then((res) => {
          setSimilarMedias(res.data);
        });
    });
  };

  const handleGoBackClick = () => {
    // TODO: Abort Request
  };

  const handleHeartClick = () => {
    axios
      .post("/favorites/toggle", {
        mediaId,
        accessToken: mainData.accessToken,
      })
      .then((res) => {
        setHearted(res.data.isHearted);
      })
      .catch((err) => {
        // alert("Couldn't fetch favorite genres..");
      });
  };

  return (
    <div className="container">
      <h1 className="single-media-title" id="title">
        <Link to="/" className="go-back" onClick={handleGoBackClick}>
          <img src="/assets/imgs/previous.png" alt="Go To Home Page" />
        </Link>

        {!singleMedia.id && "Loading.."}
        {singleMedia?.original_title}
        {singleMedia?.name}
        {singleMedia?.release_date &&
          ` (${singleMedia.release_date.substr(0, 4)})`}
        {singleMedia?.first_air_date &&
          ` (${singleMedia.first_air_date.substr(0, 4)})`}
      </h1>
      <div className="content">
        <img
          className="poster"
          src={"http://image.tmdb.org/t/p/w500" + singleMedia.poster_path}
          alt=""
        />

        {singleMedia.id && (
          <div className="movie_data">
            {singleMedia.media_type && (
              <div>
                <label>Media Type:</label>{" "}
                {singleMedia.media_type === "tv" ? "TV Show" : "Movie"}
              </div>
            )}
            {singleMedia.original_language && (
              <div>
                <label>Original Language:</label>{" "}
                {singleMedia.original_language.toUpperCase()}
              </div>
            )}
            {singleMedia.overview && (
              <div>
                <label>Overview:</label> {singleMedia.overview}
              </div>
            )}
            {singleMedia.release_date && (
              <div>
                <label>Release Date:</label>{" "}
                {getReadableDate(singleMedia.release_date)}
              </div>
            )}
            {singleMedia.first_air_date && (
              <div>
                <label>First Air Date:</label>{" "}
                {getReadableDate(singleMedia.first_air_date)}
              </div>
            )}
            {singleMedia.vote_average !== null && (
              <div>
                <label>Vote Average:</label> {singleMedia.vote_average}
              </div>
            )}
            {singleMedia.adult && (
              <div>
                <label>Adults:</label> {singleMedia.adult}
              </div>
            )}
            {singleMedia.genre_ids && (
              <div>
                <label>Genres:</label>{" "}
                {singleMedia.genre_ids.length === 0
                  ? "Unclassed"
                  : singleMedia.genre_ids.map((genreId, index) => (
                      <>
                        <span
                          className={
                            favoriteGenres.includes(genreId) ? "underlined" : ""
                          }
                        >
                          {getGenreNameFromId(genreId)}
                        </span>

                        {index !== singleMedia.genre_ids.length - 1 ? ", " : ""}
                      </>
                    ))}
              </div>
            )}
          </div>
        )}

        {singleMedia.id && localStorage.getItem("accessToken") && (
          <div className="heart-media" onClick={handleHeartClick}>
            {!isHearted ? (
              <>
                <FaRegHeart /> Add this{" "}
                {singleMedia.media_type === "tv" ? "TV Show" : "Movie"} to
                Favorites
              </>
            ) : (
              <>
                <FaHeart /> Remove this{" "}
                {singleMedia.media_type === "tv" ? "TV Show" : "Movie"} from
                Favorites
              </>
            )}
          </div>
        )}
      </div>

      <div className="similar-medias">
        <h3>
          {/* Similar {singleMedia.media_type === "tv" ? "TV Shows" : "Movies"} */}
          Similar Movies and TV Shows
        </h3>

        {similarMedias?.length === 0 && (
          <>
            <DualRing /> Working on it..
          </>
        )}

        {similarMedias?.map((media) => (
          <a
            className="single-similar-media"
            onClick={() => handleSingleSimilarMediaClick(media.id)}
            key={media.id}
            href="#title"
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
          </a>
        ))}
      </div>
    </div>
  );
};

export default SingleMedia;
