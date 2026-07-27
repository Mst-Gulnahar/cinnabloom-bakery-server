import Order from "../models/Order";
// POST /api/orders
export const createOrder = async (req, res) => {
    console.log("📥 [POST /api/orders] Payload:", JSON.stringify(req.body, null, 2));
    try {
        const { user, userId, userEmail, email, userName, items, subtotal, deliveryFee, total, totalAmount, address, destination, } = req.body;
        // Extract & normalize user email
        const rawEmail = (userEmail || email || "");
        const targetEmail = (Array.isArray(rawEmail) ? rawEmail[0] : String(rawEmail)).trim().toLowerCase();
        if (!targetEmail) {
            res.status(400).json({
                success: false,
                message: "User email is required to associate order with account.",
            });
            return;
        }
        // Auto-generate readable orderId if missing
        const orderId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        const finalTotal = Number(total || totalAmount || 0);
        const finalDeliveryFee = Number(deliveryFee ?? 2.5);
        const finalSubtotal = Number(subtotal || finalTotal - finalDeliveryFee);
        const newOrder = new Order({
            orderId,
            user: user || userId || undefined,
            userId: String(userId || user || ""),
            userEmail: targetEmail,
            userName: userName || "Customer",
            items: items || [],
            subtotal: finalSubtotal,
            deliveryFee: finalDeliveryFee,
            total: finalTotal,
            address: address || "Default Delivery Address",
            destination: destination || [24.3636, 88.6084],
            status: "In Transit",
        });
        const savedOrder = await newOrder.save();
        console.log("✅ ORDER SAVED SUCCESSFULLY TO MONGO:", savedOrder._id);
        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: savedOrder,
        });
    }
    catch (error) {
        console.error("❌ CREATE ORDER ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save order to MongoDB",
            error: error.message,
        });
    }
};
// GET /api/orders (Supports ?email= & ?userId=)
export const getOrders = async (req, res) => {
    try {
        const { email, userId } = req.query;
        let filter = {};
        if (email) {
            const emailStr = Array.isArray(email) ? String(email[0]) : String(email);
            filter.userEmail = emailStr.trim().toLowerCase();
        }
        else if (userId) {
            filter.$or = [{ user: userId }, { userId: userId }];
        }
        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        console.error("❌ GET ORDERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};
// GET /api/orders/user/:email
export const getOrdersByUser = async (req, res) => {
    try {
        const rawEmailParam = req.params.email;
        const emailParam = rawEmailParam ? String(rawEmailParam).trim().toLowerCase() : "";
        if (!emailParam) {
            res.status(400).json({ success: false, message: "User email parameter is required" });
            return;
        }
        const orders = await Order.find({ userEmail: emailParam }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    }
    catch (error) {
        console.error("❌ GET USER ORDERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message,
        });
    }
};
//# sourceMappingURL=orderController.js.map