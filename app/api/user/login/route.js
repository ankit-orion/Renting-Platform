import { NextResponse } from 'next/server';
import dbConnect from "@/database/dbConnect";
import User from "@/modals/UserModal";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    await dbConnect();

    try {
        const { email, password, rememberMe } = await req.json();

        // Debugging output
        // console.log("Request body:", { email, password });

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }

        // // Debugging output
        // console.log("User found:", user);
        // console.log("Stored hashed password:", user.password);

        // Check if password and user.password are valid
        if (!password || !user.password) {
            throw new Error("Invalid arguments for bcrypt comparison");
        }

        const isPasswordValid = await compare(password, user.password);

        // console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        const token = sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "20d" }
        );

        const response = NextResponse.json({
            message: "Login successful",
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day in seconds
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
