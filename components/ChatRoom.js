// import { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// export default function ChatRoom() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const socketRef = useRef();

//   useEffect(() => {
//     fetchMessages();
//     socketRef.current = io('', {
//       path: '/api/socket',
//       auth: { token: localStorage.getItem('token') },
//     });

//     socketRef.current.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);

//   const fetchMessages = async () => {
//     const res = await fetch('/api/messages', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//     });
//     const data = await res.json();
//     setMessages(data);
//   };

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       const res = await fetch('/api/messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ content: input }),
//       });
//       const newMessage = await res.json();
//       socketRef.current.emit('message', newMessage);
//       setInput('');
//     }
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((message) => (
//           <div key={message._id}>
//             <strong>{message.sender.username}: </strong>
//             {message.content}
//           </div>
//         ))}
//       </div>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    fetchMessages();

    socketRef.current = io('http://localhost:3000', {  // Change to your backend URL
      path: '/api/socket',
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketRef.current.on('message', (message) => {
      console.log('New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('/api/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: input }),
      });
      const newMessage = await res.json();

      // Emit message to WebSocket server
      socketRef.current.emit('message', newMessage);
      
      // Update UI immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <strong>{message.sender?.username}: </strong>
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
