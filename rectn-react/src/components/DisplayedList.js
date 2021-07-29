import { useHistory } from "react-router-dom";
import "./DisplayedList.scss";

const DisplayedList = ({ media }) => {
  const history = useHistory();

  const handlePlayClick = (mediaId) => {
    const link = `/media/${mediaId}`;
    history.push(link);
  };

  return (
    <div className="media-cards">
      {media.map((item) => (
        <div
          className="media-card"
          key={item.id}
          onClick={() => handlePlayClick(item.id)}
        >
          <img
            src={"http://image.tmdb.org/t/p/w500" + item.poster_path}
            alt="Poster"
          />

          <div className="media-card-content">
            <div>
              {item?.original_title}
              {item?.name}
            </div>
            <div>{item.genre_ids.join(", ")}</div>
            <div>
              <div>{item?.release_date.substr(0, 4)}{item?.first_air_date.substr(0, 4)}</div>
              <div>{item.vote_average}/10</div>
            </div>
          </div>

          <div>
            <img src="/assets/imgs/play.png" alt="" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayedList;
