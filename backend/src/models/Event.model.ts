import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
  category: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
