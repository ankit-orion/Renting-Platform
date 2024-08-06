import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { usePasswordLogin } from '@/app/login/hooks/usePasswordLogin';
import { passwordLoginSchema } from '@/app/login/utils/validationSchemas';
import { inputVariants } from '@/app/login/utils/animations';

const PasswordLoginForm = ({ isLoading, setIsLoading, setServerError, setServerSuccess, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(passwordLoginSchema)
    });

    const { loginWithPassword } = usePasswordLogin();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError("");
        setServerSuccess("");

        try {
            await loginWithPassword(data);
            onLoginSuccess();
        } catch (error) {
            setServerError(error.message || "An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
                <motion.div variants={inputVariants}>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        placeholder="m@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </motion.div>
                <motion.div variants={inputVariants}>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            {...register("password")}
                            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </motion.div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </div>
        </form>
    );
};

export default PasswordLoginForm;
