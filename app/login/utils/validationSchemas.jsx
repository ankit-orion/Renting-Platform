import * as z from "zod";

export const passwordLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const otpRequestSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

export const otpVerifySchema = z.object({
    otp: z.string().length(6, { message: "OTP must be 6 characters long" }),
});
