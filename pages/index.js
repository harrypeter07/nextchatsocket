import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      {isLogin ? <Login /> : <Register />}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
}