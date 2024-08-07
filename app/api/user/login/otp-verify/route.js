import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import OtpModal from "@/models/OtpModal";
import User from "@/models/UserModal";
import { cookies } from "next/headers";
import dbConnect from "@/database/dbConnect";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  await dbConnect();

  try {
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const storedOTP = await OtpModal.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!storedOTP || storedOTP.otp !== otp || Date.now() > storedOTP.expires) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const token = sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieStore = cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 1 day in seconds
      path: "/",
    });

    await OtpModal.deleteOne({ _id: storedOTP._id });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
