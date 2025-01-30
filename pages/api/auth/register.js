// import dbConnect from '../../../lib/dbConnect';
// import User from '../../../models/User';
// import bcrypt from 'bcryptjs';
// import { generateToken } from '../../../lib/auth';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     await dbConnect();
//   } catch (err) {
//     return res.status(500).json({ message: 'Database connection error' });
//   }

//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Missing credentials' });
//   }

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken(user);
//     return res.status(200).json({ token, username });
//   } catch (error) {
//     console.error('Login Error:', error);
//     return res.status(500).json({ message: 'Error logging in' });
//   }
// }

import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, username });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
}
