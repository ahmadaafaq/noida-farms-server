import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import razorpay from '../config/razorpayConfig';
import Order from '../models/OrderModel';
// 
export const refundPayment = async (req: Request, res: Response) => {
  const { order_id } = req.params;

  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.booking_status !== 'Cancelled') {
      return res.status(400).json({ message: 'Only cancelled bookings can be refunded' });
    }

    if (order.payment.status !== 'Success') {
      return res.status(400).json({ message: 'No successful payment found for refund' });
    }

    // Initiate refund
    const refund = await razorpay.payments.refund(order.payment.razorpay_payment_id, {
      amount: order.total_price * 100, // Convert to paise (smallest currency unit)
      notes: { reason: 'Booking Cancellation' },
    });

    // Update order details
    order.payment.refund_status = 'Pending';
    order.payment.refund_id = refund.id;
    await order.save();

    res.status(200).json({ message: 'Refund initiated successfully', refund });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Refund failed', error });
  }
};