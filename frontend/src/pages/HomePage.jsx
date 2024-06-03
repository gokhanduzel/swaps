import React from "react";
import img1 from "../assets/img1.png";
import imgPhone from "../assets/swapsphoneimg.png";
import { FaExchangeAlt, FaShieldAlt, FaUsers } from "react-icons/fa"; // Import some icons for visual enhancement
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="pt-40 pb-40 flex flex-col justify-center bg-gradient-to-r from-teal-400 to-blue-400 text-white">
      <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        <h1 className="text-6xl font-bold mb-2 animate-fadeIn drop-shadow-redGlow">SWAPS</h1>
        <p className="text-2xl font-light mb-8 animate-fadeIn delay-2">
          Swap Your Way, Every Day
        </p>
        <p className="max-w-xl mx-auto text-lg mb-12 animate-fadeIn delay-4">
          Discover the ultimate platform for swapping goods with others. Whether
          you're looking to exchange books, electronics, or collectibles, SWAPS
          makes it easy and secure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
          <div className="bg-gradient-to-r from-white to-gray-200 rounded-xl p-6 shadow-lg text-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="flex justify-center mb-4">
              <FaExchangeAlt className="text-teal-500 text-3xl" />{" "}
              {/* Centered icon */}
            </div>
            <h3 className="text-xl font-semibold mb-4">Easy Trading</h3>
            <p>
              Swap your items with ease using our user-friendly platform. Find
              items you love and propose swaps in minutes.
            </p>
          </div>
          <div className="bg-gradient-to-r from-white to-gray-200 rounded-xl p-6 shadow-lg text-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="flex justify-center mb-4">
              <FaShieldAlt className="text-teal-500 text-3xl" />{" "}
              {/* Centered icon */}
            </div>
            <h3 className="text-xl font-semibold mb-4">Secure Transactions</h3>
            <p>
              Feel secure with each swap. Our system ensures that all
              transactions are safe, and your data is protected.
            </p>
          </div>
          <div className="bg-gradient-to-r from-white to-gray-200 rounded-xl p-6 shadow-lg text-gray-800 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="flex justify-center mb-4">
              <FaUsers className="text-teal-500 text-3xl" />{" "}
              {/* Centered icon */}
            </div>
            <h3 className="text-xl font-semibold mb-4">Community Trust</h3>
            <p>
              Join a community of like-minded swappers who value trust and
              collaboration. Read reviews and build your reputation.
            </p>
          </div>
        </div>
        <div className="mt-20">
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-red-500 rounded-full font-semibold shadow transition duration-300 hover:bg-red-500 hover:text-white drop-shadow-redGlow"
          >
            Get Started
          </Link>
        </div>
        <img src={imgPhone} className="mt-10 max-w-full md:max-w-md" alt="Decorative" />
      </div>
    </section>
  );
};

export default HomePage;
