import mongoose from "mongoose"
interface IChat extends mongoose.Document  {
    participants: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const chatSchema = new mongoose.Schema<IChat>({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Chat = mongoose.model<IChat>("Chat", chatSchema)
export default Chat;