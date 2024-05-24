import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Login</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
