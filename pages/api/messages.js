import dbConnect from '../../lib/dbConnect';
import Message from '../../models/Message';
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
      const messages = await Message.find().populate('sender', 'username').sort({ timestamp: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages' });
    }
  } else if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const newMessage = new Message({ sender: user.id, content });
      await newMessage.save();
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: 'Error creating message' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}