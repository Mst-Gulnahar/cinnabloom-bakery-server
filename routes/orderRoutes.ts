import { Router } from "express";
import { createOrder, getOrders, getOrdersByUser } from "../controllers/orderController";

const router = Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/user/:email", getOrdersByUser);

export default router;