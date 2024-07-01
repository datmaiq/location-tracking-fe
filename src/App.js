import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import NoPage from "./pages/NoPage";
import AddLocation from "./pages/AddLocation";
import Profile from "./pages/Profile";
import AppContext from "./utils/AppContext";
import MyLocations from "./pages/MyLocations";
import MyFriends from "./pages/MyFriends";
import { applyDarkMapStyles, removeDarkMapStyles } from "./utils/map";
import UserLocation from "./pages/UserLocation";
import Message from "./pages/Message";
import io from "socket.io-client";
import { serverURL } from "./utils/urls";
import MapComponent from "./components/MapComponent";

const socket = io(serverURL);

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState(localStorage.theme || "light");

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const lightTheme = () => {
    localStorage.theme = "light";
    setTheme("light");
    removeDarkMapStyles();
  };

  const darkTheme = () => {
    localStorage.theme = "dark";
    setTheme("dark");
    applyDarkMapStyles();
  };

  return (
    <AppContext.Provider
      value={{
        authUser,
        theme,
        lightTheme,
        darkTheme,
        isLoggedIn,
        setAuthUser,
        setIsLoggedIn,
        socket: socket,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-location" element={<AddLocation />} />
            <Route path="my-locations" element={<MyLocations />} />
            <Route path="my-friends" element={<MyFriends />} />
            <Route path="profile/:username" element={<UserLocation />} />
            <Route path="chat" element={<Message />} />
            <Route path="map" element={<MapComponent />} />
            <Route path="*" element={<NoPage />} />{" "}
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
