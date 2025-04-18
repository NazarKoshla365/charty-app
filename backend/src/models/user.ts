import mongoose, { Document, Schema,Types } from "mongoose";

interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password?: string;
    profilePicture?: string;
    provider: 'google' | 'credentials';
    jwt?: string;
    createdAt?: Date;
    socketId?: string;
}
const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profilePicture: { type: String, default: null },
    provider: { type: String, enum: ['google', 'credentials'], default: 'credentials' },
    jwt: { type: String },
    createdAt: { type: Date, default: Date.now },
    socketId: { type: String, default: null }
})
const User = mongoose.model<IUser>("User", UserSchema)

export default User