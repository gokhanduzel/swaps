import React from 'react';
import { Link } from 'react-router-dom';
import notfoundpanda from "../assets/404panda.png";


const NotFoundPage = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-r from-teal-700 to-blue-400 flex flex-col items-center pt-32 pb-32">
      <h1 className="text-5xl font-bold mt-8 mb-16 animate-fadeIn drop-shadow-tealGlow text-white bg-opacity-30 bg-black px-8 py-4 rounded-xl w-5/">
        404 - Page Not Found :(
      </h1>
      <img src={notfoundpanda} alt="404 Not Found" className="w-2/5" />
      <p className="text-2xl text-white">
        You seem to be lost. Go back to the <Link className='text-red-400' to="/">home page</Link>.
      </p>
    </div>
  );
};

export default NotFoundPage;