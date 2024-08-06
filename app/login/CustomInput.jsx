// CustomInput.js
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const CustomInput = ({ id, type, label, placeholder, register, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    type={inputType}
                    id={id}
                    placeholder={placeholder}
                    {...register(id)}
                    className={error ? "border-red-500 pr-10" : "pr-10"}
                />
                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
};

export default CustomInput;
