import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import serverURL from "../utils/urls";
import AppContext from "../utils/AppContext";
import ButtonLoader from "../components/ButtonLoader";
import Autocomplete from "../components/Autocomplete";

function Signup() {
  // access global state
  const { isLoggedIn } = useContext(AppContext);
  // navigation hook
  const navigate = useNavigate();

  // state variables
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    gender: "",
    currentLocation: {},
  });
  const [signupError, setSignupError] = useState("");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleInputChange = (name, value) => {
    setInputError("");
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // handle add current location
  const handleAddCurrentLocation = (name, latitude, longitude) => {
    setUserDetails((prev) => ({
      ...prev,
      currentLocation: { name, latitude, longitude },
    }));
  };

  // handle the sign-up submission
  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    setInputError("");

    // destructure user details
    const { username, password, gender, currentLocation } = userDetails;

    // validation checks
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
    if (!gender) {
      setInputError("Please select a gender");
      setLoading(false);
      return;
    }

    // final validation check
    if (!username.trim() || !password.trim() || !gender) {
      setInputError("Please fill in required fields");
      setLoading(false);
      return;
    }

    try {
      // make a sign-up request
      const response = await axios.post(`${serverURL}/auth/signup`, {
        username,
        password,
        gender,
        currentLocation,
      });
      // display success message, reset state, and navigate to sign-in
      toast.success(response?.data?.message);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      // handle the sign-up error and display an error message
      const responseError = error?.response?.data?.message;
      toast.error(responseError || error.message);
      setLoading(false);
      setSignupError(responseError);
    }
  };

  // redirect to profile page if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className="pt-5 text-black dark:text-white">
      <h1 className="text-center font-bold text-3xl my-5">Signup</h1>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSignup}
          className="w-full mx-5 lg:mx-0 sm:w-[300px] flex flex-col space-y-5"
        >
          {signupError && (
            <p className="text-center text-red-500">{signupError}</p>
          )}
          {inputError && <p className="text-red-500">{inputError}</p>}
          <div className="flex flex-col">
            <label>
              Username
              <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handleInputChange("username", e.target.value)}
              type="text"
              className="border border-border_color  p-2 rounded text-slate-400"
            />
          </div>
          <div className="flex flex-col">
            <label>
              Password
              <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) => handleInputChange("password", e.target.value)}
              type="password"
              className=" border-border_color border p-2 rounded text-slate-400"
            />
          </div>
          <div className="flex flex-col">
            <label>
              Gender
              <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="h-12 border border-border_color rounded-md text-slate-400"
            >
              <option value="">_Select_</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <Autocomplete onAddLocation={handleAddCurrentLocation} />
          {loading ? (
            <ButtonLoader />
          ) : (
            <button
              type="submit"
              className="bg-green-500 w-full text-white p-2 border-[1px] border-border_color rounded hover:border-green-500  hover:shadow transition-all duration-200"
            >
              Signup
            </button>
          )}

          <div className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-black dark:text-white font-extrabold"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;