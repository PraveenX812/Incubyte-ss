import express from 'express';
import { getSweets, createSweet, purchaseSweet, searchSweets, updateSweet, deleteSweet, restockSweet } from '../controllers/sweetController';
import auth from '../middleware/auth';
import admin from '../middleware/admin';

const router = express.Router();

router.get('/search', auth, searchSweets); // Must be before /:id to avoid conflict
router.get('/', auth, getSweets);
router.post('/', [auth, admin], createSweet);
router.put('/:id', [auth, admin], updateSweet);
router.delete('/:id', [auth, admin], deleteSweet);

router.post('/:id/purchase', auth, purchaseSweet);
router.post('/:id/restock', [auth, admin], restockSweet);

export default router;
