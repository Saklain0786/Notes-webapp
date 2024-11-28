import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getIdFromToken from "../helpers/GetIdFromToken.js";
import Cookies from "js-cookie";
import { BorderButton } from "./BorderButton.js";

const Navbar = () => {
  const [id, setId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuhidden, setmenuHidden] = useState(false);
  const menuclick = () => {
    setmenuHidden(!menuhidden);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getIdFromToken();
      if (user) {
        setId(user._id);
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    Cookies.remove("NotesSaverToken");
    window.location.href = "/";
  };

  return (
    <div className="navbar bg-slate-400 dark:bg-gray-950 text-black dark:text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={menuclick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {menuhidden && (
            <ul
              tabIndex={0}
              className={`menu menu-md relative top-16 -left-2 h-screen dropdown-content bg-slate-800 dark:bg-gray-950 text-white dark:text-white transform translate duration-300 ease-in-out ${
                menuhidden ? "translate-x-0 " : "-translate-x-full "
              } z-10 w-52 p-2 shadow-lg transition-transform`}
            >
              <li>
                <Link to="/">Home</Link>
              </li>

              {id && (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                </>
              )}
              <li className="card p-1 ">
                <Link to="/groups/next-js-academy">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/next_indxbn.png"
                    alt="next ks"
                  />
                  Next Js
                </Link>
              </li>
              <li className="card p-1 ">
                <Link to="/groups/mern-stack-course">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/Mern_lxywzr.png"
                    alt="Mern stack"
                  />
                  Mern Stack
                </Link>
              </li>
              <li className="card p-1 ">
                <Link to="/groups/javascript-group">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/js_ta8kog.png"
                    alt="Js"
                  />
                  Javscript
                </Link>
              </li>
              <li className="card ">
                <Link to="/groups/react-js-course">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/react_sb5qud.png"
                    alt="React Js"
                  />
                  React Js
                </Link>
              </li>
            </ul>
          )}
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          Notes Saver
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className=""
            >
              Groups
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-slate-700 dark:bg-gray-950 text-black dark:text-white rounded-box z-[1] mt-4 w-52 p-2 shadow-lg"
            >
              <li className="card p-1">
                <Link to="/groups/next-js-academy">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/next_indxbn.png"
                    alt="next ks"
                  />
                  Next Js
                </Link>
              </li>
              <li className="card p-1">
                <Link to="/groups/mern-stack-course">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/Mern_lxywzr.png"
                    alt="Mern stack"
                  />
                  Mern Stack
                </Link>
              </li>
              <li className="card p-1">
                <Link to="/groups/javascript-group">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/js_ta8kog.png"
                    alt="Js"
                  />
                  Javscript
                </Link>
              </li>
              <li className="card">
                <Link to="/groups/react-js-course">
                  <img
                    src="https://res.cloudinary.com/dbqq41bpc/image/upload/v1723420829/codesaarthi/react_sb5qud.png"
                    alt="React Js"
                  />
                  React Js
                </Link>
              </li>
            </ul>
          </li>
          {id && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="toggle mr-4 ms-1"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          {id ? (
            <div onClick={handleLogout}>
              <BorderButton text="Logout" />
            </div>
          ) : (
            <Link to="/register">
              <BorderButton text="SignUp" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
