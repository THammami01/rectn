import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./page.scss";

const Profile = () => {
  const { mainData, setMainData } = useContext(AppContext);
  const history = useHistory();
  
  useEffect(() => {
    document.title = "REC TN ‣ Profile"
    if (!localStorage.getItem("accessToken")) history.push("/login");
  }, []);

  const handleDeleteAccount = () => {
    axios
      .post("/delete-account", {
        accessToken: mainData.accessToken,
      })
      .then((res) => {
        if (res.data.status === "Account Deleted") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("email");
          setMainData({})
          history.push("/");
        }
      })
      .catch((err) => {
        alert("Couldn't delete the account..");
      });
  };

  return (
    <div className="container profile">
      <h1>Profile</h1>
        <div className="content">
          <label>Username: </label>
          <p>{mainData.email?.split("@")[0]}</p>
          <label>Email: </label>
          <p>{mainData.email}</p>
          <label>Password: </label>
          <p>******</p>
          <div className="btns">
            <Link to="/favorites">
              <button>Favorite Movies and TV Shows</button>
            </Link>
            <Link to="/favorite-genres">
              <button>Favorite Genres</button>
            </Link>
            <button
              type="button"
              className="delete-btn"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
    </div>
  );
};

export default Profile;
