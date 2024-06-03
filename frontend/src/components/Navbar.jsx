import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import swapsLogo from "../assets/swaps-logo.png";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    <>
      <nav
        className={`bg-gray-800 text-white inset-x-0 fixed top-0 transition-all duration-500 ease-in-out z-20 h-16 border-b-white border-b-2 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center w-full px-4 md:px-16 h-full">
          <Link to="/" className="text-lg font-bold z-30 pl-4">
            <img
              className="absolute w-20 top-9 md:top-1/3 md:w-32"
              src={swapsLogo}
              alt="Swaps Logo"
            />
          </Link>
          {/* full size */}
          <div className="hidden md:flex items-center">
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/"
                  className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/swaps"
                  className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                >
                  Search Swaps
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/createitem"
                      className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                    >
                      Create Item
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-white font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-300 active:text-teal-500 focus:outline-none"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <button
            className="flex items-center px-4 py-6 text-white md:hidden"
            onClick={toggleMenu}
          >
            {menuOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden backdrop-blur-md bg-black/50 pt-8 w-screen text-xl border-b-2 pb-10">
            <ul className="flex flex-col items-end pr-6 gap-y-6">
              <li>
                <Link
                  to="/"
                  className="px-8 text-white-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/swaps"
                  className="px-8 py-6 text-white-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                  onClick={toggleMenu}
                >
                  Search Swaps
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/createitem"
                      className="px-8 py-6 text-white-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Create Item
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="px-8 py-6 white-teal-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="px-8 py-6 text-white-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="px-8 py-6 text-white-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="px-8 py-6 text-white-600 font-medium transition duration-300 ease-in-out transform hover:underline underline-offset-4 hover:text-teal-400 active:text-teal-200 focus:outline-none"
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
