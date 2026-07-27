import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map