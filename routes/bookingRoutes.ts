import express from 'express';
import { refundPayment } from '../controller/refundController';

const router = express.Router();

router.post('/bookings/refund/:order_id', refundPayment);

export default router;