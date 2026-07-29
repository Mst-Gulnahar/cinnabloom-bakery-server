import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<any, {}, {}, {}, any, any, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map