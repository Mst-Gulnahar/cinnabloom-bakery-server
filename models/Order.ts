import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  foodId?: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface IOrder extends Document {
  orderId: string;
  user?: mongoose.Types.ObjectId | string;
  userId?: string;
  userEmail: string;
  userName?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  destination?: [number, number];
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    userId: { type: String },
    userEmail: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true 
    },
    userName: { type: String, default: "Customer" },
    items: [
      {
        foodId: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        image: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, default: 2.5 },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    destination: { type: [Number], default: [24.3636, 88.6084] },
    status: { type: String, default: "In Transit" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);