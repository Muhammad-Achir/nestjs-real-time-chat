import { Schema, Document } from 'mongoose';

export interface Chat extends Document {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export const ChatSchema = new Schema<Chat>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
