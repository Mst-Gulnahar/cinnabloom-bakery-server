import { Router } from 'express';
import {
  addFood,
  getFoods,
  getFoodById, // <-- Added import
  updateFood,
  softDeleteFood,
} from '../controllers/foodController';

const router = Router();

router.post('/', addFood);
router.get('/', getFoods);
router.get('/:id', getFoodById); // <-- Added route
router.put('/:id', updateFood);
router.delete('/:id', softDeleteFood);

export default router;