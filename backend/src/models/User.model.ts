import mongoose, { Document, Schema } from 'mongoose';
import { Role } from '../types';

export interface IUser extends Document {
  identifiant: string;
  email?: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    identifiant: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(Role) },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
