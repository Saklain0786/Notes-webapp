import React, { useState } from "react";
import { Lamp } from "../../components/Lamp";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import config from "../../helpers/config.js";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {Helmet} from 'react-helmet';
const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  }); 

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;

    if (!email) {
      toast.error("Please enter your email", { theme: "dark" });
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email", { theme: "dark" });
      return;
    }

    document.getElementById("checkemail").style.display = "block";

    if (!password) {
      toast.error("Please enter your password to create an account", {
        theme: "dark",
      });
      return;
    }

    document.getElementById("checkpass").style.display = "block";

    try {
      setLoading(true);
      const formDataEncoded = new URLSearchParams(); 
      formDataEncoded.append("email", email);
      formDataEncoded.append("password", password);

      const response = await axios.post(
        `${config.BASE_URL}/user/signin`,
        formDataEncoded
      );

      if (response.data.status === "success") {
        toast.success("Welcome to Codesaarthi !", { theme: "dark" });
        setLoading(false);
        Cookies.set("NotesSaverToken", response.data.token, {
          expires: 30,
        });
        window.location.href = "/dashboard";
      } else {
        toast.error(response.data.message, { theme: "dark" });
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("User with this email already exists", { theme: "dark" });
      } else {
        toast.error(error.data.message, {
          theme: "dark",
        });
      }
      setLoading(false);
    }
  };

  // login through google function
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      try {
        setLoading(true);

        // Fetch user data from Google API
        const googleResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const userData = googleResponse.data;
        const formDataEncoded = new URLSearchParams();
        formDataEncoded.append("email", userData.email);
        formDataEncoded.append("name", userData.name);
        formDataEncoded.append("username", userData.given_name);
        formDataEncoded.append("image", userData.picture);

        const saveUserDataResponse = await axios.post(
          `${config.BASE_URL}/user/saveuserData`,
          formDataEncoded
        );

        if (saveUserDataResponse.data.status === "success") {
          Cookies.set("NotesSaverToken", saveUserDataResponse.data.token, {
            expires: 30,
          });
          setLoading(false);
          window.location.href = "/dashboard";
        } else {
          toast.error("Error saving user data", { theme: "dark" });
          console.log(saveUserDataResponse.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("Error during login. Please try again later.", {
          theme: "dark",
        });
        setLoading(false);
      }
    },
    onFaliure: (error) => {
      console.error("Error during login:", error);
      toast.error("Error during login. Please try again later.", {
        theme: "dark",
      });
      setLoading(false);
    },
  });

 
  return (
    <>
      <Toaster />
      <Helmet>
  <title>Login - Notes Saver</title>
  <meta
    name="description"
    content="Login to Notes Saver to access and manage your saved notes efficiently."
  />
  <meta
    name="keywords"
    content="Notes Saver, Login, Sign In, Notes Management, Save Notes"
  />
  <meta name="author" content="Notes Saver Team" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Login - Notes Saver" />
  <meta
    property="og:description"
    content="Login to Notes Saver to access and manage your saved notes efficiently."
  />
  <meta property="og:image" content="/logo.png" />
  <meta
    property="og:url"
    content="https://noteswebapp-rust.vercel.app/login"
  />
  <meta property="og:site_name" content="Notes Saver" />
</Helmet>

      <div className="min-h-screen bg-slate-400 dark:bg-gray-950">
        <div className="flex justify-between">
          <div className="flex justify-center  items-center  pb-12 flex-1"> 
                <div className=" space-y-4" style={{ width: "420px" }}>
                  <form onSubmit={handleSubmit}>
                    <div className="text-center">
                      <img
                        src="https://res.cloudinary.com/ducw7orvn/image/upload/v1723392218/_adab1c9f-9272-481d-8642-1eeee5f32cbf-removebg-preview_x4jz3f.png"
                        className="mx-auto rounded-full h-24"
                        alt="Logo"
                      />
                      <h3 className="pt-3 text-black dark:text-white">
                        Welcome Back !!
                      </h3>
                      <br />
                    </div>

                    

                    {/* Email input */}
                    <div className="mb-4 flex">
                      <input
                        type="email"
                        id="emailId"
                        name="email"
                        required
                        value={formData.email}
                        className=" w-full p-2 rounded-xl text-black dark:text-white bg-white dark:bg-slate-700"
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                      <i
                        id="checkemail"
                        style={{ color: "#79b4e2", display: "none" }}
                        className="fi fi-ss-check-circle text-center ms-2 mt-2"
                      ></i>
                    </div>

                    {/* Password input */}
                    <div className="mb-4 flex">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        className=" w-full p-2 rounded-xl text-black dark:text-white bg-white dark:bg-slate-700"
                        onChange={handleInputChange}
                        placeholder="Password"
                        required
                      />
                      <i
                        id="passwordViewer"
                        onClick={togglePasswordVisibility}
                        className={`fi ${
                          isPasswordVisible ? "fi-ss-eye" : "fi-ss-eye-crossed"
                        } mt-2 ms-2 cursor-pointer`}
                        style={{ color: "#703BF7" }}
                      ></i>
                      <i
                        id="checkpass"
                        style={{ color: "#79b4e2", display: "none" }}
                        className="fi fi-ss-check-circle text-center ms-2 mt-2"
                      ></i>
                    </div>
                       
                       <div className="flex items-end justify-end my-2">
                       <Link to = "/forgot-password"><p className="text-black dark:text-stone-100">Forgot password</p> </Link> 
                       </div>
                        
                    {/* Submit button */}
                    {loading ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-block mb-4 text-capitalize py-3"
                          style={{ fontSize: "1rem" }}
                          disabled
                        >
                          Welcome Back to NotesSaver ...
                          <span className="loading loading-spinner loading-md"></span>
                        </button>
                      </>
                    ) : (
                      <button
                        id="login_button"
                        data-mdb-ripple-init
                        type="button"
                        className="btn btn-block mb-4 text-capitalize py-3 text-white"
                        style={{ fontSize: "1rem" }}
                        onClick={handleSubmit}
                      >
                        Log In 
                        <i className="fi fi-rs-sign-out-alt ps-2 pt-2"></i>
                      </button>
                    )}

                    <h3
                      className="text-center mb-3 text-black dark:text-white"
                      style={{
                        fontWeight: "light",
                        fontSize: "1rem",
                      }}
                    >
                      - OR -
                    </h3>

                    {/* Google login button */}
                    <div className="text-center mb-2">
                      <div className="row d-flex justify-content-evenly align-items-center">
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn bg-light w-100"
                            onClick={login}
                          >
                            <img
                              src="https://res.cloudinary.com/ducw7orvn/image/upload/v1720990440/search_1_cw9o1p.png"
                              style={{ height: "26px" }}
                              alt="Google Icon"
                            />
                            <span className=" text-capitalize ms-2">
                              Sign Up With Google
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-black dark:text-white">
                      <p>
                        Don't have an Account No worries
                        <Link to="/register" style={{ color: "#703BF7" }}>
                          {" "}
                          register here
                        </Link>
                      </p>
                    </div>
                  </form>
                </div> 
          </div>
          <div className="hidden md:block flex-1">
            <Lamp title1={"Welcome back "} title2={"To Your Notes Web app ..."} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
