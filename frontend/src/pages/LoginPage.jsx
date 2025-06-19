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
      navigate('/upload-invoice');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Welcome Back</h2>

        <input
          style={styles.input}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit" style={styles.button}>Login</button>

        <p style={styles.text}>
          Don’t have an account?
          <button type="button" onClick={() => navigate('/signup')} style={styles.linkButton}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  text: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  linkButton: {
    marginLeft: '0.5rem',
    background: 'none',
    color: '#007BFF',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};
