import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function SignupPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { userName, password });
      alert('Account created — please log in');
      nav('/login');
    } catch (err) {
      if (err.response?.status === 409) alert('User already exists');
      else alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9e6] to-white flex justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="p-8 rounded-xl bg-[#f9f9f9] shadow-lg flex flex-col w-[300px]"
      >
        <h2 className="text-center mb-6 text-xl text-[#333] font-semibold">Create Account</h2>

        <label htmlFor="username" className="sr-only">Username</label>
        <input
          id="username"
          name="username"
          className="mb-4 p-3 text-base rounded-lg border border-gray-300"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          required
        />

        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="mb-4 p-3 text-base rounded-lg border border-gray-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
          required
        />

        <button
          type="submit"
          className="p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors mt-2"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?
          <button
            type="button"
            onClick={() => nav('/login')}
            className="ml-2 text-blue-600 underline hover:text-blue-800 text-sm"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
