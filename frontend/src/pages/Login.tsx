import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username: email,
        password: password,
      });
  
      const { access } = response.data;
  
      // Decode the token (now contains role and user info)
      const decoded: any = jwtDecode(access);
  
      const userData: User = {
        id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,                    // Now we get real role
        first_name: decoded.first_name || '',
        last_name: decoded.last_name || '',
        phone_number: decoded.phone_number || '',
      };
  
      login(access, userData);
  
      // Smart redirect based on role
      switch (userData.role) {
        case 'landlord':
          navigate('/landlord/dashboard');
          break;
        case 'relocator':
          navigate('/relocator/dashboard');
          break;
        case 'tenant':
        default:
          navigate('/tenant/dashboard');
          break;
      }
  
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        "Invalid username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome to pace</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Username or Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;