import mongoose, { Types, Document, Schema } from "mongoose";

type ReplyTo = {
  id: Types.ObjectId | null;
  text: string;
}
interface IMessage extends Document {
  chat: Types.ObjectId;
  from: Types.ObjectId;
  message: string;
  timestamp: Date;
  replyTo?: ReplyTo;
  deletedFor?: Types.ObjectId[];
  deletedForEveryone?: boolean;
}

const messageSchema = new mongoose.Schema<IMessage>({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replyTo: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    text: { type: String, default: "" }
  },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  deletedForEveryone: { type: Boolean, default: false },
})

const Message = mongoose.model<IMessage>("Message", messageSchema)

export default Message

