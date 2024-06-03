import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-r from-teal-400 to-blue-400 flex flex-col items-center pt-32 pb-32">
      <h1 className="text-5xl font-bold mt-8 mb-16 animate-fadeIn drop-shadow-tealGlow text-white bg-opacity-30 bg-black px-8 py-4 rounded-xl w-5/">
        LOGIN
      </h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
