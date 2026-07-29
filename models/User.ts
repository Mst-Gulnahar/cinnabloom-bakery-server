import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  profilePicture?: string;
  photoUrl?: string;
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function() { return !this.avatar; } }, // Optional if using OAuth
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);