import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useOTPLogin } from './hooks/useOTPLogin';
import { otpRequestSchema, otpVerifySchema } from './utils/validationSchemas';
import { inputVariants } from './utils/animations';
const OTPLoginForm = ({ isLoading, setIsLoading, setServerError, setServerSuccess, onLoginSuccess }) => {
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");

    const { requestOTP, verifyOTP } = useOTPLogin();

    const {
        register: registerOTPRequest,
        handleSubmit: handleSubmitOTPRequest,
        formState: { errors: otpRequestErrors }
    } = useForm({
        resolver: zodResolver(otpRequestSchema)
    });

    const {
        register: registerOTPVerify,
        handleSubmit: handleSubmitOTPVerify,
        formState: { errors: otpVerifyErrors }
    } = useForm({
        resolver: zodResolver(otpVerifySchema)
    });

    const onSubmitOTPRequest = async (data) => {
        setIsLoading(true);
        setServerError("");
        setServerSuccess("");

        try {
            await requestOTP(data.email);
            setOtpEmail(data.email);
            setShowOTPInput(true);
            setServerSuccess("OTP sent to your email. Please verify to complete login.");
        } catch (error) {
            setServerError(error.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitOTPVerify = async (data) => {
        setIsLoading(true);
        setServerError("");
        setServerSuccess("");

        try {
            await verifyOTP(otpEmail, data.otp);
            onLoginSuccess();
        } catch (error) {
            setServerError(error.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!showOTPInput ? (
                <form onSubmit={handleSubmitOTPRequest(onSubmitOTPRequest)}>
                    <div className="grid w-full items-center gap-4">
                        <motion.div variants={inputVariants}>
                            <Label htmlFor="otpEmail">Email</Label>
                            <Input
                                type="email"
                                id="otpEmail"
                                placeholder="m@example.com"
                                {...registerOTPRequest("email")}
                                className={otpRequestErrors.email ? "border-red-500" : ""}
                            />
                            {otpRequestErrors.email && <p className="text-red-500 text-sm mt-1">{otpRequestErrors.email.message}</p>}
                        </motion.div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmitOTPVerify(onSubmitOTPVerify)}>
                    <div className="grid w-full items-center gap-4">
                        <motion.div variants={inputVariants}>
                            <Label htmlFor="otp">OTP</Label>
                            <Input
                                type="text"
                                id="otp"
                                placeholder="Enter 6-digit OTP"
                                {...registerOTPVerify("otp")}
                                className={otpVerifyErrors.otp ? "border-red-500" : ""}
                            />
                            {otpVerifyErrors.otp && <p className="text-red-500 text-sm mt-1">{otpVerifyErrors.otp.message}</p>}
                        </motion.div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </div>
                </form>
            )}
        </>
    );
};

export default OTPLoginForm;
