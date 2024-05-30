import express from 'express';
import { createSwapRequest, getSwapRequests, updateSwapRequest, acceptSwapRequest, declineSwapRequest } from '../controllers/swapController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new swap request
router.post('/createswap', authenticate, createSwapRequest);

// Route to update a swap request by ID
router.put('/updateswap/:id', authenticate, updateSwapRequest);

router.route('/acceptswap/:swapId').put(authenticate, acceptSwapRequest);

router.route('/declineswap/:swapId').put(authenticate, declineSwapRequest);

// Route to get all swap requests for the logged-in user
router.get('/getswaps', authenticate, getSwapRequests);

export default router;
