// Importing necessary modules and components from React and project files
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
const socket = io("http://localhost:8000");

// Main App component
function App() {
  const [authUser, setAuthUser] = useState(null); // Authenticated user information
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Flag indicating if the user is logged in or not
  const [theme, setTheme] = useState(localStorage.theme || "light"); // Theme preference (light or dark)

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark"); // Apply dark theme
    } else {
      document.documentElement.classList.remove("dark"); // Remove dark theme
    }
  }, [theme]);

  // Function to set and apply light theme
  const lightTheme = () => {
    localStorage.theme = "light";
    setTheme("light");
    removeDarkMapStyles(); // Remove dark map styles if applied
  };

  // Function to set and apply dark theme
  const darkTheme = () => {
    localStorage.theme = "dark";
    setTheme("dark");
    applyDarkMapStyles(); // Apply dark map styles
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
      {/* Setting up routing with BrowserRouter and Routes */}
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
            <Route path="*" element={<NoPage />} />{" "}
            {/* Catch-all route for unknown paths */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

// Export the App component as the default export of the file
export default App;
