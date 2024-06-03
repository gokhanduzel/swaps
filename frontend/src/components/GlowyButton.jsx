import React from 'react';
import "../index.css";
import { Link } from 'react-router-dom';

const GlowyButton = ({ children, onClick }) => {
  return (
    <Link
      onClick={onClick}
      className="relative py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 button-glow"
    >
      {children}
    </Link>
  );
};

export default GlowyButton;
