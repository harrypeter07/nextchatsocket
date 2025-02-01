import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, {timestamps: true});
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;
