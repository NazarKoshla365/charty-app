import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { generateJwtToken } from "../utils/generateJwt";
import User from "../models/user";
import { generateAvatar } from "../utils/generateAvatar";
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from "../utils/verifyToken";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);



export const checkAuth = async (req: Request, res: Response) => {
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:"User not found"})
        }

        return res.json({ message: "User is authenticated", user:{
            userId: decoded.id,
            username: user.username,
            email:user.email,
            profile: user.profilePicture,
        }})
    }
    catch (err) {
        console.error('Check auth error:', err);
        res.clearCookie("token"); 
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
}

export const googleAuth = async (req: Request, res: Response) => {
    const { token } = req.body
    if (!token) {
        return res.status(400).json({ message: "Token is required" })
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload();
        const userEmail = payload?.email;
        const userName = payload?.name;


        if (userEmail) {
            let user = await User.findOne({ email: userEmail })
            if (!user) {
                user = new User({
                    username: userName,
                    email: userEmail,
                    provider: 'google',
                });
                await user.save();
            }
            if (userName) {
                try {
                    const userPicture = await generateAvatar(userName);
                
                    const res = await cloudinary.uploader.upload(userPicture, {
                        public_id: user._id.toString(),
                        resource_type: 'auto',
                    })
                    user.profilePicture = res.secure_url
                    user.save()
                }
                catch (err) {
                    console.error('Error uploading image to Cloudinary:', err);
                    return res.status(500).json({ message: 'Server error' });
                }
            }
            const jwtToken = generateJwtToken(user._id.toString());
            res.cookie("token", jwtToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })
            return res.status(200).json({
                message: 'Google login successful',
            });
        }
        return res.status(400).json({ message: "Google token is invalid" });
    }
    catch (err) {
        console.error('Google auth error:', err);
        return res.status(500).json({ message: 'Server error' });
    }

}

export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const saltRounds = 12;
        const hashedpassword = await bcrypt.hash(password, saltRounds)
        const newUser = new User({
            username: username,
            email: email,
            password: hashedpassword,
            provider: 'credentials'
        })
        await newUser.save()

        const userPicture = generateAvatar(username)

        const jwtToken = generateJwtToken(newUser._id.toString());
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        return res.status(200).json({
            message: "User created successfully",
        })
    }
    catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        if (!user.password) {
            return res.status(400).json({ message: "User password is missing" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const jwtToken = generateJwtToken(user._id.toString());
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })

        res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                profile: user.provider,
            }
        })

    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}

