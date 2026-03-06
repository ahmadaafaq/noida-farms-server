import express from 'express';
import { razorpayWebhookHandler } from '../controller/webhookController';

const router = express.Router();
router.post('/razorpay/webhook', razorpayWebhookHandler);
export default router;