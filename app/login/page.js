"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import PasswordLoginForm from './PasswordLoginForm';
import OTPLoginForm from './OTPLoginForm';
import { pageVariants } from './utils/animations';
import { useLoginState } from './hooks/useLoginState';
import { Twitter, Mail, ArrowLeft } from 'lucide-react';
import { signIn } from "next-auth/react"

const LoginPage = () => {
    const router = useRouter();
    const { isLoading, serverError, serverSuccess, setServerError, setServerSuccess, setIsLoading } = useLoginState();
    const [showEmailLogin, setShowEmailLogin] = useState(false);

    const handleLoginSuccess = () => {
        setServerSuccess("Login successful!");
        router.push('/');
    };

    const handleSocialLogin = async (provider) => {
        await signIn(provider, { callbackUrl: '/' });
        console.log(`Logging in with ${provider}`);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
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
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Welcome back! Please log in to your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">
                            {!showEmailLogin ? (
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
                                            onClick={() => handleSocialLogin('google')}
                                            className="w-full"
                                        >
                                            <Mail className="mr-2 h-4 w-4" />
                                            Continue with Google
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleSocialLogin('twitter')}
                                            className="w-full"
                                        >
                                            <Twitter className="mr-2 h-4 w-4" />
                                            Continue with Twitter
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowEmailLogin(true)}
                                        className="w-full"
                                    >
                                        Login with Email
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="email-login"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowEmailLogin(false)}
                                        className="mb-4"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Login Options
                                    </Button>
                                    <Tabs defaultValue="password">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="password">Password</TabsTrigger>
                                            <TabsTrigger value="otp">OTP</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="password">
                                            <PasswordLoginForm
                                                isLoading={isLoading}
                                                setIsLoading={setIsLoading}
                                                setServerError={setServerError}
                                                setServerSuccess={setServerSuccess}
                                                onLoginSuccess={handleLoginSuccess}
                                            />
                                        </TabsContent>
                                        <TabsContent value="otp">
                                            <OTPLoginForm
                                                isLoading={isLoading}
                                                setIsLoading={setIsLoading}
                                                setServerError={setServerError}
                                                setServerSuccess={setServerSuccess}
                                                onLoginSuccess={handleLoginSuccess}
                                            />
                                        </TabsContent>
                                    </Tabs>
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
                    <CardFooter className="flex flex-col items-center space-y-2">
                        <p className="text-sm text-gray-500">Dont have an account? <Link href={`/signup`} className="text-blue-500">Sign up</Link></p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
