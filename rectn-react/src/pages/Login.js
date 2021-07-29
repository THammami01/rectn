import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppContext } from "../App";
import "./page.scss";

const Login = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isNewlyRegistered, setNewlyRegistered] = useState(null);
  const history = useHistory();
  const { setMainData } = useContext(AppContext);
  const search = useLocation().search;

  useEffect(() => {
    setNewlyRegistered(new URLSearchParams(search).get("newly-registered"));
    document.title = "REC TN ‣ Login";
    if (localStorage.getItem("accessToken")) history.push("/");
  }, []);

  useEffect(() => {
    console.log("==================");
    console.log(isNewlyRegistered);
    console.log("==================");
  }, [isNewlyRegistered]);

  const handleLogin = async () => {
    setError("");
    if (!state.email || !state.password) {
      setError("Please fill all fields first.");
      return;
    }

    await axios
      .post("/login", state)
      .then((res) => {
        if (res.data.status === "Logged In") {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("email", state.email);
          setMainData({
            accessToken: res.data.accessToken,
            email: state.email,
          });
          history.push("/");
        } else setError("Invalid Logins.");
      })
      .catch((err) => {
        alert("Couldn't log out..");
      });
  };

  const handleInputs = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <h1>Log In</h1>
      {isNewlyRegistered && (
        <p className="alert">
          You've been successfully registered!
          <br />
          You can login now.
        </p>
      )}
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            autoFocus
            placeholder="Please enter your email"
            onChange={handleInputs}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Please enter your password"
            onChange={handleInputs}
            onKeyDown={handleKeyDown}
            required
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Log In Now
        </button>
        {error && <label className="error">{error}</label>}
      </form>
    </div>
  );
};

export default Login;
