import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { serverURL } from "../utils/urls";
import AppContext from "../utils/AppContext";
import ButtonLoader from "../components/ButtonLoader";

export default function Signin() {
  const { isLoggedIn, setIsLoggedIn, setAuthUser } = useContext(AppContext);

  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });
  const [signinError, setSigninError] = useState("");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setInputError("");
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignin = async (e) => {
    setLoading(true);
    e.preventDefault();
    setInputError("");
    const { username, password } = userDetails;

    if (!username.trim()) {
      setInputError("Please enter a username");
      setLoading(false);
      return;
    }
    if (!password.trim() || password.length <= 6) {
      setInputError("Please enter a password with more than 6 characters");
      setLoading(false);
      return;
    }

    if (!username.trim() || !password.trim()) {
      setInputError("Please fill in required fields");
      setLoading(false);
      return;
    }

    try {
      const {
        data: { data },
      } = await axios.post(`${serverURL}/auth/signin`, {
        username,
        password,
      });

      const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1hr
      Cookies.set("authToken", data.token, {
        expires: expirationTime,
        sameSite: "None",
        secure: true,
      });
      Cookies.set("user", data.user.username, {
        expires: expirationTime,
        sameSite: "None",
        secure: true,
      });

      toast.success("Login successful!");
      navigate("/profile");
      setAuthUser(data.user);
      setIsLoggedIn(true);
      setLoading(false);
    } catch (error) {
      const responseError = error?.response?.data?.message;
      toast.error(responseError || error.message);
      setSigninError(responseError);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="pt-5  dark:text-white ">
      <h1 className="text-center font-bold text-3xl my-5">Signin</h1>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSignin}
          className="w-full mx-5 lg:mx-0 sm:w-[300px] flex flex-col space-y-5 "
        >
          {signinError && (
            <p className="text-center text-red-500">{signinError}</p>
          )}

          {inputError && <p className="text-red-500">{inputError}</p>}
          <div className="flex flex-col">
            <label className="">Username</label>
            <input
              onChange={(e) => {
                handleInputChange("username", e.target.value);
              }}
              type="text"
              className="border-border_color border p-2 rounded text-slate-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="">Password</label>
            <input
              onChange={(e) => {
                handleInputChange("password", e.target.value);
              }}
              type="password"
              className="border-border_color border p-2 rounded text-slate-400"
            />
          </div>
          {loading ? (
            <ButtonLoader />
          ) : (
            <button
              type="submit"
              className="bg-primary-500 w-full text-white p-2 border-[1px] border-border_color rounded hover:border-primary-500  hover:shadow transition-all duration-200"
            >
              Login
            </button>
          )}
          <div className="text-center text-sm text-slate-400">
            Don't have an account?
            <Link
              to="/signup"
              className="text-black dark:text-white font-extrabold"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
