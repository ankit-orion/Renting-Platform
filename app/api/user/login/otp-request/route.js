import dbConnect from "@/database/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/UserModal";
import OtpModal from "@/models/OtpModal";
import { sendEmail } from "@/utils/auth";
import crypto from "crypto";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  await dbConnect();

  try {
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const otpData = new OtpModal({
      email,
      otp,
      expires: Date.now() + 600000, // 10 minutes
    });

    await otpData.save();

    await sendEmail(
      email,
      "Your Login OTP",
      `Your OTP for login is: ${otp}. It will expire in 10 minutes.`
    );

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP request error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
