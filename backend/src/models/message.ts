import mongoose, { Types, Document, Schema } from "mongoose";
interface IMessage extends Document {
    chat: Types.ObjectId;  // Зв'язок з чатом
    from: Types.ObjectId;  // Зв'язок з користувачем, що відправив повідомлення
    message: string;  // Текст повідомлення
    timestamp: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },  // Зв'язок з чатом
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    message: { type: String, required: true },  // Текст повідомлення
    timestamp: { type: Date, default: Date.now }, // Час відправлення
})

const Message = mongoose.model<IMessage>("Message",messageSchema)

export default Message

