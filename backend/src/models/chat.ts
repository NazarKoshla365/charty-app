import mongoose from "mongoose"

interface IPinnedMessage {
    confirmed: boolean;
    msgId: string;
    pinMessage: string;
    from: string;
    pinTime: string;
}

interface IChat extends mongoose.Document {
    participants: mongoose.Types.ObjectId[];
    createdAt: Date;
    pinnedMessage?: IPinnedMessage;
}
const pinnedMessageSchema = new mongoose.Schema<IPinnedMessage>({
  confirmed: { type: Boolean, required: true },
  msgId: { type: String, required: true },
  pinMessage: { type: String, required: true },
  from: { type: String, required: true },
  pinTime: { type: String, required: true },
}, { _id: false });

const chatSchema = new mongoose.Schema<IChat>({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    pinnedMessage: { type: pinnedMessageSchema, required: false },
})

const Chat = mongoose.model<IChat>("Chat", chatSchema)
export default Chat;