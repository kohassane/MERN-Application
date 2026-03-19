import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  summary: string;
  content: string;
  date: Date;
  imageUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    imageUrl: { type: String },
    author: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<INews>('News', NewsSchema);
