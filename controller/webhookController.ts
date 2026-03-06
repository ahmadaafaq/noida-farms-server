// controllers/webhookController.ts
import { Request, Response } from 'express';
import crypto from 'crypto';
import Order from '../models/orderModel';

export const razorpayWebhookHandler = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = JSON.stringify(req.body);

  // Validate Signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const { event, payload } = req.body;

  try {
    if (event === 'payment.refunded') {
      const paymentId = payload.payment.entity.id;
      const order = await Order.findOne({ 'payment.razorpay_payment_id': paymentId });

      if (order) {
        order.payment.refund_status = 'Completed';
        await order.save();
      }
    }
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};
