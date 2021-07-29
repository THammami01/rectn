import { useContext, useState } from "react";
import { Route, Link } from "react-router-dom";
import { AppContext } from "../App";
import axios from "axios";
import Hamburger from "./Hamburger";
import { useHistory } from "react-router-dom";

const Navbar = () => {
  const { mainData, setMainData } = useContext(AppContext);
  const [showSmScreenNavbar, setShowSmScreenNavbar] = useState(false);
  const history = useHistory();

  const handleHamburger = () => {
    setShowSmScreenNavbar(!showSmScreenNavbar);
  };

  const handleLogOut = async () => {
    await axios
      .post("/logout", { token: mainData.token })
      .then((res) => {
        if (res.data.status === "Logged Out") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("email");
          history.push("/");
          setMainData({});
        }
      })
      .catch((err) => {
        alert("Couldn't log out..");
      });
  };

  const closeSmScreenNavbar = () => {
    setShowSmScreenNavbar(false);
  };

  const getUsername = () => {
    const leftPart = mainData.email.split("@")[0];
    return leftPart.length > 12 ? leftPart.substr(0, 12) + ".." : leftPart;
  };

  return (
    <>
      <nav className="navbar">
        <div className="leftnav">
          <Link to="/">
            <img src="/assets/imgs/icon.png" alt="RECTN" />
          </Link>
          <ul>
            <Route exact path="/">
              <li>
                {" "}
                <a href="#movies">TOP MOVIES</a>
              </li>
              <li>
                {" "}
                <a href="#tvshows">TOP TV-SERIES</a>
              </li>
              <li>
                <Link to="/search">SEARCH</Link>
              </li>
            </Route>
          </ul>
        </div>
        <div className="rightnav">
          <Hamburger handleHamburger={handleHamburger} />
          {!mainData.accessToken ? (
            <>
              <Link to="/login">
                <button className="login">LOGIN</button>
              </Link>
              <Link to="/register">
                <button className="register">REGISTER</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <button className="login profile-btn">
                  <img
                    src={`/assets/imgs/identicons/000${
                      Math.floor(Math.random() * 3) + 1
                    }.png`}
                    alt="Identicon"
                    className="small-identicon"
                  />{" "}
                  <p>{getUsername()}</p>
                </button>
              </Link>
              <button className="register" onClick={handleLogOut}>
                LOG OUT
              </button>
            </>
          )}
        </div>
      </nav>

      {showSmScreenNavbar && (
        <div className="bottom-navbar-sm-screen" onClick={closeSmScreenNavbar}>
          <Route exact path="/">
            <a href="#movies">
              <button>TOP MOVIES</button>
            </a>
            <a href="#tvshows">
              <button>TOP TV-SERIES</button>
            </a>
            <Link to="/search">
              <button>SEARCH</button>
            </Link>
          </Route>

          {!mainData.accessToken ? (
            <>
              <Link to="/login">
                <button>LOGIN</button>
              </Link>
              <Link to="/register">
                <button>REGISTER</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <button className="profile-btn">
                  <img
                    src={`/assets/imgs/identicons/000${
                      Math.floor(Math.random() * 3) + 1
                    }.png`}
                    alt="Identicon"
                    className="small-identicon"
                  />{" "}
                  <p>{getUsername()}</p>
                </button>
              </Link>

              <button className="register" onClick={handleLogOut}>
                LOG OUT
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
