import mongoose, { Document, Schema } from 'mongoose';
import { PartnerTier } from '../types';

export interface IPartner extends Document {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  tier: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    logoUrl: { type: String },
    websiteUrl: { type: String },
    tier: { type: String, required: true, enum: Object.values(PartnerTier) },
  },
  { timestamps: true }
);

export default mongoose.model<IPartner>('Partner', PartnerSchema);
