import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function LoginPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { userName, password });
      localStorage.setItem('token', res.data.token);
      navigate('/upload-invoice'); // redirect after login
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
      <p>Don't have an account?</p>
      <button type="button" onClick={() => navigate('/signup')}>
        Go to Sign Up
      </button>
    </form>
  );
}

