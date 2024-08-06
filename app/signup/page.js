"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, ArrowLeft, Mail, Twitter } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
};

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

// Define schema for form validation
const signupSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const otpSchema = z.object({
    otp: z.string().length(6, { message: "OTP must be 6 characters long" }),
});

const SignupPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [showEmailSignup, setShowEmailSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [signupData, setSignupData] = useState(null);

    const { register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: signupErrors } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const { register: registerOTP, handleSubmit: handleSubmitOTP, formState: { errors: otpErrors } } = useForm({
        resolver: zodResolver(otpSchema)
    });

    const onSubmitSignup = async (data) => {
        setIsLoading(true);
        setServerError("");
        setServerSuccess("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: data.username, email: data.email, password: data.password }),
            });

            if (response.ok) {
                setEmail(data.email);
                setSignupData(data);  // Store the signup data
                setShowOTPInput(true);
                setServerSuccess("OTP sent to your email. Please verify to complete signup.");
            } else {
                const errorData = await response.json();
                setServerError(errorData.message);
            }
        } catch (error) {
            setServerError("An error occurred during signup. Please try again.");
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitOTP = async (data) => {
        setIsLoading(true);
        setServerError("");
        setServerSuccess("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/signup`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: signupData.email,
                    username: signupData.username,
                    password: signupData.password,
                    otp: data.otp
                }),
            });

            if (response.ok) {
                setServerSuccess("Signup successful!");
                setShowOTPInput(false);
                router.push("/");
            } else {
                const errorData = await response.json();
                setServerError(errorData.message);
            }
        } catch (error) {
            setServerError("An error occurred during OTP verification. Please try again.");
            console.error("OTP verification error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignup = async (provider) => {
        await signIn(provider, { callbackUrl: '/' });
        console.log(`Signing up with ${provider}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>{showOTPInput ? "Verify OTP" : "Sign Up"}</CardTitle>
                        <CardDescription>{showOTPInput ? "Enter the OTP sent to your email" : "Create your account"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">
                            {!showEmailSignup && !showOTPInput ? (
                                <motion.div
                                    key="providers"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="grid gap-4 mb-6">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleSocialSignup('google')}
                                            className="w-full"
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Continue with Google
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleSocialSignup('twitter')}
                                            className="w-full"
                                        >
                                            <Twitter className="mr-2 h-4 w-4" />
                                            Continue with Twitter
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowEmailSignup(true)}
                                        className="w-full"
                                    >
                                        Sign up with Email
                                    </Button>
                                </motion.div>
                            ) : showEmailSignup && !showOTPInput ? (
                                <motion.div
                                    key="email-signup"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowEmailSignup(false)}
                                        className="mb-4"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Signup Options
                                    </Button>
                                    <form onSubmit={handleSubmitSignup(onSubmitSignup)}>
                                        <div className="grid w-full items-center gap-4">
                                            <motion.div variants={inputVariants}>
                                                <Label htmlFor="username">Username</Label>
                                                <Input
                                                    type="text"
                                                    id="username"
                                                    placeholder="johndoe"
                                                    {...registerSignup("username")}
                                                    className={signupErrors.username ? "border-red-500" : ""}
                                                />
                                                {signupErrors.username && <p className="text-red-500 text-sm mt-1">{signupErrors.username.message}</p>}
                                            </motion.div>
                                            <motion.div variants={inputVariants}>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    placeholder="m@example.com"
                                                    {...registerSignup("email")}
                                                    className={signupErrors.email ? "border-red-500" : ""}
                                                />
                                                {signupErrors.email && <p className="text-red-500 text-sm mt-1">{signupErrors.email.message}</p>}
                                            </motion.div>
                                            <motion.div variants={inputVariants}>
                                                <Label htmlFor="password">Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        {...registerSignup("password")}
                                                        className={signupErrors.password ? "border-red-500 pr-10" : "pr-10"}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                                                    </button>
                                                </div>
                                                {signupErrors.password && <p className="text-red-500 text-sm mt-1">{signupErrors.password.message}</p>}
                                            </motion.div>
                                            <motion.div variants={inputVariants}>
                                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        {...registerSignup("confirmPassword")}
                                                        className={signupErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                                                    </button>
                                                </div>
                                                {signupErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword.message}</p>}
                                            </motion.div>
                                            <Button className="w-full" type="submit" disabled={isLoading}>
                                                {isLoading ? "Signing up..." : "Sign Up"}
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp-input"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <form onSubmit={handleSubmitOTP(onSubmitOTP)}>
                                        <div className="grid w-full items-center gap-4">
                                            <motion.div variants={inputVariants}>
                                                <Label htmlFor="otp">OTP</Label>
                                                <Input
                                                    type="text"
                                                    id="otp"
                                                    placeholder="Enter 6-digit OTP"
                                                    {...registerOTP("otp")}
                                                    className={otpErrors.otp ? "border-red-500" : ""}
                                                />
                                                {otpErrors.otp && <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>}
                                            </motion.div>
                                            <Button className="w-full" type="submit" disabled={isLoading}>
                                                {isLoading ? "Verifying..." : "Verify OTP"}
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {serverError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}
                        {serverSuccess && (
                            <Alert variant="success" className="mt-4">
                                <AlertDescription>{serverSuccess}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    {!showOTPInput && (
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-gray-500">Already have an account? <Link href="/login" className="text-blue-500">Log in</Link></p>
                        </CardFooter>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default SignupPage;
