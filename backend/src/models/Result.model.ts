import mongoose, { Document, Schema } from 'mongoose';

interface ITeam {
  name: string;
  score: number;
  position?: number;
}

export interface IResult extends Document {
  eventId: mongoose.Types.ObjectId;
  eventName: string;
  date: Date;
  category: string;
  teams: ITeam[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    position: { type: Number },
  },
  { _id: false }
);

const ResultSchema = new Schema<IResult>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventName: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    teams: { type: [TeamSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IResult>('Result', ResultSchema);
