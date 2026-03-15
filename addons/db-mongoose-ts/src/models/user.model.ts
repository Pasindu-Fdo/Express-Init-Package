import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    photoUrl: { type: String },
    role: { type: String, enum: ["superadmin", "admin", "user"], default: "user" },
    locale: { type: String, default: "en-US" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model("User", UserSchema);
