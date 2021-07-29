import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { FaSearch } from "react-icons/fa";
import "./page.scss";
import axios from "axios";

const Favorites = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    document.title = "REC TN ‣ Search";
  }, []);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSearch = () => {
    if (title.length < 6) {
      setMessage("Please enter a title that is 6 characters or more.");
      return;
    }

    setMessage("");
    alert("Not implemented yet.")
    
    // axios
    //   .get(`http://rec76.pythonanywhere.com/search/${title}`)
    //   .then((res) => {
    //     if (res.data.length === 0) setMessage("There was no match.");
    //     else setMessage(`${res.data.length} found.`);
    //     setMatched(res.data);
    //   })
    //   .catch((err) => {});
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <h1>Search</h1>
      <div className="input-btn-search">
        <input
          type="text"
          placeholder="Enter a title (min 6 chars)"
          autoFocus
          onChange={handleTitle}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      <div className="content">
        <p className="search-msg">{message}</p>
        {matched.map((item) => (
          <p>
            {item?.title} {item?.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
