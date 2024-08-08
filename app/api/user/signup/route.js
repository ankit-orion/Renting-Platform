import dbConnect from "@/database/dbConnect";
import User from "@/models/UserModal";
import { hash, genSalt} from "bcryptjs";
import { z } from "zod";
import {sign} from "jsonwebtoken";
import {NextResponse} from "next/server";

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(req) {
    if (req.method !== 'POST') {
        return Response.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { username, email, password } = signupSchema.parse(body);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "20d" }
        );

        const response = NextResponse.json({
            message: "User created successfully",
        }, { status: 201 });

        // Set token in cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
            path: '/',
        });

        return response;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ message: error.errors[0].message }, { status: 400 });
        }
        console.error('Signup error:', error);
        return Response.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    if (req.method !== 'PUT') {
        return Response.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    await dbConnect();

    try {
        const body = await req.json();
        const { email, otp, username, password } = otpSchema.extend({
            username: z.string().min(3, "Username must be at least 3 characters long"),
            password: z.string().min(8, "Password must be at least 8 characters long"),
        }).parse(body);

        const storedOTP = await OtpModal.findOne({
            email
        }).sort({ createdAt: -1 }).limit(1);
        // console.log(storedOTP, otp, Date.now() > storedOTP.expires);
        if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expires) {
            return Response.json({ message: 'Invalid or expired OTP' }, { status: 400 });
        }


        // Hash password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        await OtpModal.deleteOne({ _id: storedOTP._id }); // Remove the OTP from storage

        const token = sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "20d" }
        );

        const response = NextResponse.json({
            message: "User created successfully",
        }, { status: 201 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  30 * 24 * 60 * 60, // 30 days or 1 day in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json({ message: error.errors[0].message }, { status: 400 });
        }
        console.error('OTP verification error:', error);
        return Response.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
