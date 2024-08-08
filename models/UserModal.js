import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:false,
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    userType: {
        type: String,
        enum: ['Client', 'Provider'],
        required: [true, 'User type is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminType: {
        type: String,
        enum: ['Super', 'Moderator', 'Support']
    },
    password: {
        type: String,
        required: false,
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    dob: {
        type: Date,
        validate: {
            validator: function(v) {
                return v <= new Date();
            },
            message: props => `${props.value} is not a valid date of birth!`
        }
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    location: {
        type: {
            type: String,
            enum: ['Point','Address','PINCODE'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: false
        },
        address: String,
        pincode: String
    },
    profilePicture: {
        type: String,
        default: 'default-profile.jpg'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    preferences: {
        age: {
            min: {
                type: Number,
                min: 18
            },
            max: {
                type: Number,
                max: 100
            }
        },
        gender: [String],
        services: [String],
        location: String,
        maxDistance: {
            type: Number,
            default: 50 // in kilometers
        }
    },
    verificationStatus: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        },
        govtId: {
            type: Boolean,
            default: false
        }
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    otp: {
        email: {
            code: String,
            timestamp: Date,
            attempts: {
                type: Number,
                default: 0
            }
        },
        phone: {
            code: String,
            timestamp: Date,
            attempts: {
                type: Number,
                default: 0
            }
        }
    },
    authProvider: {
        type: String,
        enum: ['Google', 'Email', 'Twitter'],
        default: 'Email'
    },
    coverPicture: {
        type: String,
        default: 'default-cover.jpg'
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String
    },
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        }
    },
    language: {
        type: String,
        default: 'en'
    },
    timezone: String,
    availabilityHours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        start: String,
        end: String
    }],
    accountStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Deactivated'],
        default: 'Active'
    },
    lastPasswordChange: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date
}, {
    timestamps: true
});

// Indexes
userSchema.index({ username: 1, email: 1 },
    { unique: true });
userSchema.index({ location: '2dsphere' });

// Pre-save hooks and methods (as before)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
