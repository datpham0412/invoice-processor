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
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Create account</button>
      <p>Already have an account?</p>
      <button type="button" onClick={() => nav('/login')}>
        Go to Login
      </button>
    </form>
  );
}
