"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
const mongoose_1 = require("mongoose");
const foodSchema = new mongoose_1.Schema({
    product_name: { type: String, required: true, trim: true },
    product_price: { type: Number, required: true, min: 0 },
    product_description: { type: String, required: true },
    img_url: { type: String, required: true },
    category_id: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    flavor: {
        type: String,
        enum: ['sweet', 'sour', 'spicy', 'salty', 'tangy', 'savory'],
        lowercase: true,
        trim: true
    },
    country_of_origin: { type: String, trim: true },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived', 'deleted'],
        default: 'active',
    },
    is_featured: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true
});
// Indexes for super fast searching & filtering
foodSchema.index({ product_name: 'text', product_description: 'text' });
foodSchema.index({ category_id: 1, flavor: 1, country_of_origin: 1, product_price: 1 });
exports.Food = (0, mongoose_1.model)('Food', foodSchema);
//# sourceMappingURL=Food.js.map