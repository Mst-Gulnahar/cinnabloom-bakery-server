import { Food } from '../models/Food';
// @desc    Add a new food item
// @route   POST /api/foods
export const addFood = async (req, res) => {
    try {
        const { product_name, product_price, product_description, img_url, category_id, flavor, country_of_origin, status, is_featured, } = req.body;
        if (!product_name || !product_price || !product_description || !img_url || !category_id) {
            res.status(400).json({ success: false, message: 'Please provide all required fields.' });
            return;
        }
        const newFood = await Food.create({
            product_name,
            product_price,
            product_description,
            img_url,
            category_id,
            flavor,
            country_of_origin,
            status: status || 'active',
            is_featured: is_featured || false,
        });
        res.status(201).json({
            success: true,
            message: 'Food item added successfully! ✨',
            data: newFood,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add food item.',
            error: error.message,
        });
    }
};
// @desc    Get all food items with advanced filtering (Name, Category, Flavor, Country, Price Range)
// @route   GET /api/foods
export const getFoods = async (req, res) => {
    try {
        const { search, category, flavor, country, minPrice, maxPrice, is_featured, sort } = req.query;
        // Base query: Always exclude deleted items
        const query = {
            status: { $ne: 'deleted' },
            deletedAt: null,
        };
        // 1. Search by Name / Keyword
        if (search) {
            query.$or = [
                { product_name: { $regex: search, $options: 'i' } },
                { product_description: { $regex: search, $options: 'i' } }
            ];
        }
        // 2. Filter by Category (dumplings, ramens, pastries, stew/soup, fried, etc.)
        if (category) {
            query.category_id = category.toString().toLowerCase();
        }
        // 3. Filter by Flavor Profile (sweet, sour, spicy, salty, tangy, savory)
        if (flavor) {
            query.flavor = flavor.toString().toLowerCase();
        }
        // 4. Filter by Country of Origin
        if (country) {
            query.country_of_origin = { $regex: country, $options: 'i' };
        }
        // 5. Featured filter
        if (is_featured !== undefined) {
            query.is_featured = is_featured === 'true';
        }
        // 6. Price Range Filtering
        if (minPrice || maxPrice) {
            query.product_price = {};
            if (minPrice)
                query.product_price.$gte = Number(minPrice);
            if (maxPrice)
                query.product_price.$lte = Number(maxPrice);
        }
        // Sorting logic (default to newest first)
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc')
            sortOption = { product_price: 1 };
        if (sort === 'price_desc')
            sortOption = { product_price: -1 };
        const foods = await Food.find(query).sort(sortOption);
        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch foods.',
            error: error.message
        });
    }
};
// @desc    Get a single food item by ID
// @route   GET /api/foods/:id
export const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await Food.findById(id);
        if (!food || food.status === 'deleted') {
            res.status(404).json({ success: false, message: 'Food item not found.' });
            return;
        }
        res.status(200).json({ success: true, data: food });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch food item.',
            error: error.message
        });
    }
};
// @desc    Update a food item
// @route   PUT /api/foods/:id
export const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFood = await Food.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedFood) {
            res.status(404).json({ success: false, message: 'Food item not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Food item updated successfully!',
            data: updatedFood,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update food item.' });
    }
};
// @desc    Soft delete a food item
// @route   DELETE /api/foods/:id
export const softDeleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFood = await Food.findByIdAndUpdate(id, {
            status: 'deleted',
            deletedAt: new Date(),
        }, { new: true });
        if (!deletedFood) {
            res.status(404).json({ success: false, message: 'Food item not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Food item removed successfully.',
            data: deletedFood,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete food item.' });
    }
};
//# sourceMappingURL=foodController.js.map