"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const foodController_1 = require("../controllers/foodController");
const router = (0, express_1.Router)();
router.post('/', foodController_1.addFood);
router.get('/', foodController_1.getFoods);
router.get('/:id', foodController_1.getFoodById); // <-- Added route
router.put('/:id', foodController_1.updateFood);
router.delete('/:id', foodController_1.softDeleteFood);
exports.default = router;
//# sourceMappingURL=foodRoutes.js.map