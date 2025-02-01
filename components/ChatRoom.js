// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import io from 'socket.io-client';

// export default function ChatRoom() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [user, setUser] = useState(null);
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const username = localStorage.getItem('username');

//     if (!token || !username) {
//       router.push('/');
//       return;
//     }

//     setUser({ username });
//     fetchMessages();

//     // Connect to WebSocket with the correct URL
//     socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
//       path: '/api/socket',
//       auth: { token },
//       transports: ['websocket', 'polling'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     socketRef.current.on('connect', () => console.log('Connected to WebSocket'));

//     socketRef.current.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       if (error.message === 'Authentication error') router.push('/');
//     });

//     socketRef.current.on('message', (newMessage) => {
//       if (newMessage && newMessage.content) {
//         setMessages((prevMessages) => {
//           const seenMessages = new Set(prevMessages.map((msg) => msg._id));
//           return seenMessages.has(newMessage._id) ? prevMessages : [...prevMessages, newMessage];
//         });
//       }
//     });

//     socketRef.current.on('error', (error) => console.error('Socket error:', error));

//     return () => socketRef.current.disconnect();
//   }, [router , fetchMessages ]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const fetchMessages = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch('/api/messages', {
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//       });

//       if (!res.ok) {
//         if (res.status === 401) router.push('/');
//         throw new Error('Failed to fetch messages');
//       }

//       const data = await res.json();
//       if (Array.isArray(data)) setMessages(data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

 
 
 

 
 
//  //updated
 
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
  
//     try {
//       const token = localStorage.getItem('token');
//       const username = localStorage.getItem('username'); // Get username from localStorage
//       const res = await fetch('/api/messages', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ content: input, sender: { username } }), // Include sender info
//       });
  
//       if (!res.ok) {
//         if (res.status === 401) router.push('/');
//         throw new Error('Failed to send message');
//       }
  
//       const newMessage = await res.json();
//       socketRef.current.emit('message', newMessage);
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       setInput('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };
  
 
 

 
 
 
 

 
 

 
 
 
 
 

//   const handleLogout = () => {
//     socketRef.current?.disconnect();
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     router.push('/');
//   };

//   if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <div className="bg-white shadow-md p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Chat Room</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-600">Welcome, {user.username}</span>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//       <div className="flex-grow overflow-auto p-4 space-y-4">
//         {messages.map((message, index) => (
//           <div
//             key={message._id || index}
//             className={`p-2 rounded-lg ${
//               message.sender?.username === user.username ? 'bg-blue-500 text-blue-600 ml-auto' : 'bg-gray-200 mr-auto'
//             } max-w-[70%]`}
//           >
//             <p className="text-black font-bold text-sm">{message.sender?.username || 'Unknown'}</p>
//             <p className='text-slate-600'>{message.content}</p>
//             <p className="text-teal-600 text-xs text-right mt-1 opacity-70">
//               {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
//             </p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={sendMessage} className="bg-white p-4 border-t">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // ✅ Move fetchMessages BEFORE useEffect
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        if (res.status === 401) router.push('/');
        throw new Error('Failed to fetch messages');
      }

      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      router.push('/');
      return;
    }

    setUser({ username });
    fetchMessages(); // ✅ Now correctly placed

    socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      path: '/api/socket',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => console.log('Connected to WebSocket'));

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (error.message === 'Authentication error') router.push('/');
    });

    socketRef.current.on('message', (newMessage) => {
      if (newMessage && newMessage.content) {
        setMessages((prevMessages) => {
          const seenMessages = new Set(prevMessages.map((msg) => msg._id));
          return seenMessages.has(newMessage._id) ? prevMessages : [...prevMessages, newMessage];
        });
      }
    });

    socketRef.current.on('error', (error) => console.error('Socket error:', error));

    return () => socketRef.current.disconnect();
  }, []); // ❌ Remove fetchMessages from dependencies

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: input, sender: { username } }),
      });

      if (!res.ok) {
        if (res.status === 401) router.push('/');
        throw new Error('Failed to send message');
      }

      const newMessage = await res.json();
      socketRef.current.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Room</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user.username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`p-2 rounded-lg ${
              message.sender?.username === user.username ? 'bg-blue-500 text-blue-600 ml-auto' : 'bg-gray-200 mr-auto'
            } max-w-[70%]`}
          >
            <p className="text-black font-bold text-sm">{message.sender?.username || 'Unknown'}</p>
            <p className='text-slate-600'>{message.content}</p>
            <p className="text-teal-600 text-xs text-right mt-1 opacity-70">
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="bg-white p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
