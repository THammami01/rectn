import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Notification from "./partials/Notification";
import Navbar from "./partials/Navbar";
import Carousel from "./components/Carousel";
import Movies from "./components/Movies";
import MoviesGenres from "./components/MoviesGenres";
import TVShows from "./components/TVShows";
import TVShowsGenres from "./components/TVShowsGenres";
import Footer from "./components/Footer";
import GoToTop from "./partials/GoToTop";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import FavoriteGenres from "./pages/FavoriteGenres";
import SingleMedia from "./pages/SingleMedia";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import "./index.scss";

export const AppContext = createContext();


const App = () => {
  const [mainData, setMainData] = useState({});

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    if (accessToken && email) setMainData({ accessToken, email });
  }, []);

  return (
    <AppContext.Provider value={{ mainData, setMainData }}>
      <Router>
        <Notification />
        <Navbar />
        <Switch >
          <Route exact path="/">
            <Carousel />
            <Movies />
            <MoviesGenres />
            <TVShows />
            <TVShowsGenres />
            <Footer />
            <GoToTop />
          </Route>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/favorites" component={Favorites} />
          <Route exact path="/favorite-genres" component={FavoriteGenres} />
          <Route exact path="/media/:mediaId" component={SingleMedia} />
          <Route exact path="/search" component={Search} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
