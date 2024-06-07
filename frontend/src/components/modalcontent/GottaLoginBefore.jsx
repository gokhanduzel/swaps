import { Link } from "react-router-dom";
import loginPanda from "../../assets/loginPanda.png";

const GottaLoginBefore = () => {
  return (
    <div className="bg-yellow-100 flex items-center justify-center flex-col gap-y-2">
      <img className="w-3/5" src={loginPanda} />
      <p>Well, whatever you are trying to do, you gotta login to do that!</p>
      <div className="flex justify-center">
        <Link
          to="/login"
          className="py-2 px-11 bg-red-400 text-white rounded-2xl font-semibold shadow transition duration-300 hover:bg-red-500 hover:text-white border-2 border-gray-800"
        >
          LOGIN
        </Link>
      </div>
      <div className="text-md font-medium text-gray-700 mt-6 text-center">
        Not registered?{" "}
        <Link to="/register" className="text-teal-500 hover:underline">
          Create a new account
        </Link>
      </div>
    </div>
  );
};

export default GottaLoginBefore;
