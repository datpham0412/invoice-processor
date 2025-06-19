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
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

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

        <button type="submit" style={styles.button}>Sign Up</button>

        <p style={styles.text}>
          Already have an account?
          <button type="button" onClick={() => nav('/login')} style={styles.linkButton}>
            Login
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
    backgroundColor: '#28a745',
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
