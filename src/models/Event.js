import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailDescription: { type: String },
  eventType: { type: String, required: true },
  scientificField: { type: String, required: true },
  theme: { type: String, required: true },
  targetAudience: { type: [String], required: true },
  format: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  submissionDeadline: { type: Date },
  link: { type: String },
  language: { type: String, required: true },
  organizer: { type: String, required: true },
  tags: { type: [String] },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], required: true, default: 'pending' },
  statusBadge: { type: String,  enum: ['New', 'Upcoming', 'Closing Soon', "Ended"], default: 'Upcoming' },
  submittedBy: { type: String, required: true },
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
