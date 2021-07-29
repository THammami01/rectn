import { useState, useEffect } from "react";
import axios from "axios";
import "./Carousel.scss";
import { getGenreNameFromId } from "../utils/getGenre";
import { useHistory } from "react-router-dom";

const Carousel = () => {
  const [currentCarouselImg, setCurrentCarouselImg] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const history = useHistory();

  const handleCarouselImgChange = (offset) => {
    let id = currentCarouselImg + offset;
    if (id === -1) id = recommended.length - 1;
    if (id === recommended.length) id = 0;
    setCurrentCarouselImg(id);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "REC TN";
    // you can fetch as much as you want (not only 3)
    axios.get("http://rec76.pythonanywhere.com/top-trending").then((res) => {
      res.data.forEach((movie) => {
        movie.genre_ids = movie.genre_ids.map((id) => getGenreNameFromId(id));
      });
      setRecommended(res.data);
    });
  }, []);

  const handlePlayClick = () => {
    const link = `/media/${recommended[currentCarouselImg]?.id}`;
    history.push(link);
  };

  return (
    <section className="carousel">
      {recommended.length ? (
        <>
          <img
            src={
              "http://image.tmdb.org/t/p/w500" +
              recommended[currentCarouselImg].backdrop_path
            }
            alt="Trending Display"
          />
          <img className="overlay" src="/assets/imgs/overlay.png" alt="" />
          <img
            className="previous"
            src="/assets/imgs/previous.png"
            alt="Previous Trending"
            onClick={() => handleCarouselImgChange(-1)}
          />
          <img
            className="next"
            src="/assets/imgs/next.png"
            alt="Next Trending"
            onClick={() => handleCarouselImgChange(1)}
          />
          <div className="content">
            <div>
              <h3>
                {recommended[currentCarouselImg]?.original_title}
                {recommended[currentCarouselImg]?.name}
              </h3>
              <div>
                <strong>Genre: </strong>
                {recommended[currentCarouselImg].genre_ids.join(", ")}
              </div>
              <div>
                <strong>Rating: </strong>
                {recommended[currentCarouselImg].vote_average}
              </div>
              <p>{recommended[currentCarouselImg].overview}</p>
              <button onClick={handlePlayClick}>View Movie</button>
            </div>
          </div>
        </>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </section>
  );
};

export default Carousel;
