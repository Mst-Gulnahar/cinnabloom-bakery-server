"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const foodRoutes_1 = __importDefault(require("./routes/foodRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect Database
(0, db_1.connectDB)();
// Routes
app.use('/api/foods', foodRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map