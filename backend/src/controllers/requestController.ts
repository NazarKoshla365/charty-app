import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";


export const friendRequest = async (req: Request, res: Response) => {
  const { username } = req.body
  const token = req.cookies.token
  if (!token) {
    return res.status(400).json({ message: "Unauthorized" })
  }
  if (!username) {
    return res.status(400).json({ message: "Username is required" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User not found" })
    }
    const targetUser = await User.findOne({username})
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

      if((targetUser.friendRequests ?? []).includes(currentUser._id)) {
        return res.status(400).json({ message: "You are already friends with this user" })
      }
      targetUser.friendRequests = targetUser.friendRequests ?? [];
      targetUser.friendRequests.push(currentUser._id)
      await targetUser.save()
      

    return res.status(200).json({ message: "Friend request sent" });
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Server error" })
  }
}