import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import { HiMiniMoon, HiOutlineSun } from "react-icons/hi2";
import useAuth from "../hooks/useAuth";
import AppContext from "../utils/AppContext";

export default function Header() {
  const { setIsLoggedIn, theme, setAuthUser, lightTheme, darkTheme } =
    useContext(AppContext);
  const navigate = useNavigate();

  const { authUser, isLoggedIn } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuBar = () => {
    setMenuOpen((prev) => !prev);
  };

  const logout = () => {
    Cookies.remove("authToken", { sameSite: "None", secure: true });
    setIsLoggedIn(false);
    setAuthUser(null);
    navigate("/signin");
  };

  return (
    <div className="fixed top-0 z-[100] left-0 w-full text-black dark:text-white bg-slate-100 dark:bg-black">
      <div className="h-[80px] max-h-[80px]  flex justify-between items-center space-x-5  py-3 p-2 lg:p-4 ">
        <Link
          to="/"
          className="font-extrabold no-underline hover:no-underline w-1/2 hover:text-primary-500"
        >
          Location Tracker
        </Link>

        <div className="hidden md:flex items-end md:space-x-3 justify-end w-1/2">
          {isLoggedIn ? (
            <div className="flex items-center">
              <Link to="/profile">
                <img
                  src={authUser?.profileBanner}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <Link
                to="/add-location"
                className="bg-primary-600 text-white ml-3 p-2 border-[1px] border-border_color rounded hover:border-primary-500  hover:shadow transition-all duration-200 no-underline hover:no-underline"
              >
                Add Location
              </Link>
              <Link
                to="/chat"
                className="bg-primary-600 text-white ml-3 p-2 border-[1px] border-border_color rounded hover:border-primary-500  hover:shadow transition-all duration-200 no-underline hover:no-underline"
              >
                Chat
              </Link>
              <button
                type="button"
                onClick={logout}
                className="ml-3 p-2 border-[2px] rounded hover:bg-rose-500 hover:text-white hover:outline-rose-500 focus:outline-red-500  hover:shadow transition-all duration-200 no-underline hover:no-underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="">
              <Link
                to="/signin"
                className="text-black dark:text-white hover:text-black  ml-3 p-2 border-[1px] border-border_color rounded hover:border-primary-500  hover:shadow transition-all duration-200 no-underline hover:no-underline"
              >
                Signin
              </Link>
              <Link
                to="/add-location"
                className="bg-primary-500 text-white ml-3 p-2 border-[1px] border-border_color rounded hover:border-primary-500  hover:shadow transition-all duration-200 no-underline hover:no-underline"
              >
                Add Location
              </Link>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center">
          <div>
            {theme === "light" ? (
              <button
                type="button"
                onClick={darkTheme}
                className=" focus:bg-transparent  p-5 outline-none border-none flex items-center justify-center"
              >
                <HiMiniMoon />
              </button>
            ) : (
              <button
                type="button"
                onClick={lightTheme}
                className=" focus:bg-transparent active:bg-transparent bg-transparent group p-5 outline-none border-none rounded-full flex items-center justify-center  "
              >
                <HiOutlineSun className=" text-white" />
              </button>
            )}
          </div>

          <div className="flex md:hidden h-full">
            {menuOpen ? (
              <button type="button" onClick={handleMenuBar}>
                <IoCloseSharp size={24} />
              </button>
            ) : (
              <button type="button" id="toggleBtn" onClick={handleMenuBar}>
                <IoMenu size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        id="menuContent"
        className={`overflow-hidden bg-white dark:bg-gray-700  block lg:hidden  transition-all duration-300 ${
          menuOpen
            ? "h-screen visible pb-3 opacity-100 "
            : "h-0 invisible opacity-0"
        }`}
      >
        {isLoggedIn ? (
          <div className=" flex pt-20 before:flex flex-col justify-center items-center space-y-5 relative py-3 px-2">
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/profile"
              className="flex items-center justify-center no-underline hover:no-underline w-40 p-2 bg-primary-600 rounded text-white shadow transition-all duration-200 "
            >
              <span>My Profile</span>
            </Link>
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/add-location"
              className="bg-primary-600 w-40 text-center text-white p-2 rounded hover:shadow transition-all duration-200 no-underline hover:no-underline"
            >
              Add Location
            </Link>
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/chat"
              className="bg-primary-600 w-40 text-center text-white p-2 rounded hover:shadow transition-all duration-200 no-underline hover:no-underline"
            >
              Chat
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="w-40 p-2 rounded border-[2px] border-white hover:bg-secondary-700 hover:border-secondary-700 hover:text-white text-black dark:text-white shadow transition-all duration-200 no-underline hover:no-underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className=" flex pt-20 before:flex flex-col justify-center items-center space-y-5 relative py-3 px-2">
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/signin"
              className="text-black dark:text-white text-center rounded border-[2px] border-white hover:bg-secondary-700 hover:border-secondary-700 w-40 font-black p-2   transition-all duration-200 no-underline hover:no-underline"
            >
              Signin
            </Link>
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              to="/add-location"
              className="bg-primary-500 text-center w-40 text-white p-2 border-[1px] border-border_color rounded hover:border-primary-500  hover:shadow transition-all duration-200 no-underline hover:no-underline"
            >
              Add Location
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
