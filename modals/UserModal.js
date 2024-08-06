import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide your username"],
        trim: true,
        unique: [true, "Username already exists"],
        maxLength: [100, "Your name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "Email already exists"],
        trim: true,
        maxLength: [100, "Your email cannot exceed 100 characters"],
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minLength: [6, "Your password must be at least 6 characters long"],

    },
},
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
