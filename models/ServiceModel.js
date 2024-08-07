import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Please provide your service name"],
      trim: true,
      maxLength: [100, "Your service name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide your service description"],
      trim: true,
      maxLength: [
        1000,
        "Your service description cannot exceed 1000 characters",
      ],
    },
    category: {
      type: String,
      required: [true, "Please provide your service category"],
    },
    location: {
      type: String,
      required: [true, "Please provide your service location"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide your service price"],
    },
    duration: {
      startDuration: {
        type: new Date(),
        required: [true, "Please provide your service start duration"],
      },
      endDuration: {
        type: new Date(),
        required: [true, "Please provide your service end duration"],
      },
    },
    agePreference: {
      minimumAge: {
        type: Number,
        required: [true, "Please provide your service minimum age"],
      },
      maximumAge: {
        type: Number,
        required: [true, "Please provide your service maximum age"],
      },
    },
    genderPreference: {
      type: String,
      required: [true, "Please provide your service"],
      enum: ["Male", "Female", "Both", "Others", "Not Specified"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceModel = mongoose.model("Service", serviceSchema);
