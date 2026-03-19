import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from '../types';

interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  status: string;
  total: number;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    total: { type: Number, required: true, min: 0 },
    items: { type: [OrderItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
