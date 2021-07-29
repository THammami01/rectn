import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import "./page.scss";

const Register = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.title = "REC TN ‣ Register";
    if (localStorage.getItem("accessToken")) history.push("/");
  }, []);

  const handleInputs = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    if (!state.email || !state.password) {
      setError("Please fill all fields first.");
      return;
    }

    await axios
      .post("/register", state)
      .then((res) => {
        if (res.data.status === "Registered") {
          history.push("/login?newly-registered=true");
        } else setError("An occor occured.");
      })
      .catch((err) => {
        if (err.response?.status === 409)
          setError("User with the same email exists.");
        else setError("An occor occured.");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
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
        <button type="button" onClick={handleRegister}>
          Register Now
        </button>
        {error && <label className="error">{error}</label>}
      </form>
    </div>
  );
};

export default Register;
