import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-r from-blue-400 to-teal-400 flex flex-col items-center pt-32 pb-32">
      <h1 className="text-5xl font-bold mt-8 mb-16 animate-fadeIn drop-shadow-purpleGlow text-white bg-opacity-30 bg-black px-8 py-4 rounded-xl">
        REGISTER
      </h1>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;
