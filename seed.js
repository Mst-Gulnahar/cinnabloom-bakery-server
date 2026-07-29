"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Food_1 = require("./models/Food");
dotenv_1.default.config();
const SEED_FOODS = [
    {
        product_name: "Spicy Firebird Chicken Ramen",
        product_price: 12.50,
        product_description: "Hand-pulled noodles in a rich, spicy chicken broth, topped with tender chicken slice, soft-boiled egg, and chili oil.",
        img_url: "https://i.pinimg.com/control1/1200x/a1/b8/57/a1b857dbc844f67786449c4aa3d296f8.jpg",
        category_id: "ramens",
        flavor: "spicy",
        country_of_origin: "Japan",
        status: "active",
        is_featured: true,
    },
    {
        product_name: "Tonkotsu Garlic Pork Ramen",
        product_price: 13.80,
        product_description: "Silky 16-hour pork bone broth served with springy noodles, chashu pork belly, black garlic oil, and bamboo shoots.",
        img_url: "https://i.pinimg.com/control1/736x/06/eb/1a/06eb1a718f7eadae49e10180339e0982.jpg",
        category_id: "ramens",
        flavor: "savory",
        country_of_origin: "Japan",
        status: "active",
        is_featured: true,
    },
    {
        product_name: "Sweet Cherry Dessert Dumplings",
        product_price: 7.00,
        product_description: "Soft steamed dough pouches stuffed with tart cherry compote and served with a light powdered glaze.",
        img_url: "https://i.pinimg.com/control1/1200x/19/24/ed/1924ed1bb5eca6c2e02e403ac85e9ee4.jpg",
        category_id: "dumplings",
        flavor: "sweet",
        country_of_origin: "Poland",
        status: "active",
        is_featured: false,
    },
    {
        product_name: "Cozy Tabletop Hot Pot",
        product_price: 15.99,
        product_description: "A steaming bowl filled with fresh vegetables, mushrooms, tofu, and sliced meats simmered in aromatic broth.",
        img_url: "https://i.pinimg.com/control1/736x/a4/c3/0e/a4c30e6134fcf1e05f0dcf6c411be746.jpg",
        category_id: "stew/soup",
        flavor: "savory",
        country_of_origin: "China",
        status: "active",
        is_featured: false,
    },
    {
        product_name: "Velvety Chicken Cream Stew",
        product_price: 11.80,
        product_description: "Hearty slow-cooked chicken breasts, carrots, and potato chunks in a rich savory cream reduction sauce.",
        img_url: "https://i.pinimg.com/control1/1200x/92/64/cc/9264cc8ea626e4892fc723d19cc0dcc8.jpg",
        category_id: "stew/soup",
        flavor: "savory",
        country_of_origin: "France",
        status: "active",
        is_featured: false,
    },
    {
        product_name: "Golden Butter Croissant",
        product_price: 3.25,
        product_description: "Flaky, multi-layered French butter croissant with a crisp golden crust and a soft honeycomb center.",
        img_url: "https://i.pinimg.com/control1/736x/75/cf/68/75cf68e29f8d032a10e790d8df2ed431.jpg",
        category_id: "pastries",
        flavor: "sweet",
        country_of_origin: "France",
        status: "active",
        is_featured: false,
    },
    {
        product_name: "Crispy Golden Karaage Chicken",
        product_price: 8.50,
        product_description: "Japanese-style double-fried chicken thighs marinated in ginger soy sauce, served with tangy kewpie mayo.",
        img_url: "https://i.pinimg.com/control1/736x/a5/c1/e9/a5c1e96f475adb23a8cc17a2208c0be0.jpg",
        category_id: "fried",
        flavor: "tangy",
        country_of_origin: "Japan",
        status: "active",
        is_featured: true,
    },
];
const seedDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in .env file.");
        }
        console.log("🌱 Connecting to MongoDB...");
        await mongoose_1.default.connect(mongoUri);
        console.log("🧹 Clearing all existing food items...");
        await Food_1.Food.deleteMany({}); // Clears out all old data
        console.log("✨ Seeding fresh Cinnabloom menu with new categorization schema...");
        const createdFoods = await Food_1.Food.insertMany(SEED_FOODS);
        console.log(`✅ Successfully seeded ${createdFoods.length} items into MongoDB! ✨`);
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};
seedDatabase();
//# sourceMappingURL=seed.js.map