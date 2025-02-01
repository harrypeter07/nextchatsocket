import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/chat');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Welcome to Chat App
          </h1>
          
          <div className="space-y-6">
            {isLogin ? <Login /> : <Register />}
            
            <div className="text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}