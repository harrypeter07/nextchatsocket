import dbConnect from '../../lib/dbConnect';
import Message from '../../models/Message';
import User from '../../models/User';  // Import User model
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Populate sender's username properly
      const messages = await Message.find().populate('sender', 'username').sort({ timestamp: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages' });
    }
  } else if (req.method === 'POST') {
    try {
      const { content } = req.body;

      // Fetch the user's username from the database
      const userData = await User.findById(user.id, 'username');
      if (!userData) return res.status(404).json({ message: 'User not found' });

      // Save message with user ID
      const newMessage = new Message({ sender: user.id, content });
      await newMessage.save();

      // Send back the correct response with username included
      res.status(201).json({
        _id: newMessage._id,
        content: newMessage.content,
        sender: { _id: user.id, username: userData.username }, 
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating message' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
