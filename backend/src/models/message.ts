import mongoose, { Types, Document, Schema } from "mongoose";

type ReplyTo = {
    id: Types.ObjectId | null;
    text: string;
  }
interface IMessage extends Document {
    chat: Types.ObjectId;  // Зв'язок з чатом
    from: Types.ObjectId;
    message: string;  // Текст повідомлення
    timestamp: Date;
    replyTo?: ReplyTo;

}

const messageSchema = new mongoose.Schema<IMessage>({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },  // Зв'язок з чатом
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },  // Текст повідомлення
    timestamp: { type: Date, default: Date.now }, // Час відправлення
    replyTo: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
        text: { type: String, default: "" }
      } // Зв'язок з відповіддю на інше повідомлення
})

const Message = mongoose.model<IMessage>("Message", messageSchema)

export default Message

