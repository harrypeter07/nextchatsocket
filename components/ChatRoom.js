import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetchMessages(); // Load previous messages when component mounts

    socketRef.current = io('http://localhost:3001', {  // Change to your backend URL
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    // Listen for new messages from the server
    socketRef.current.on('receiveMessage', (message) => {
      console.log('New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ content: input }),
        });

        if (!res.ok) throw new Error('Failed to send message');
        const newMessage = await res.json();

        // Emit message to WebSocket server
        socketRef.current.emit('sendMessage', newMessage);

        // UI updates only after confirmation from server
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender?.username || 'Anonymous'}: </strong>
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
