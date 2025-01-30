import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChatRoom from '../components/ChatRoom';

export default function Chat() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <ChatRoom />
      <button onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/');
      }}>Logout</button>
    </div>
  );
}