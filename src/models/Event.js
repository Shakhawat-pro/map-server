import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  detailDescription: {
    en: { type: String },
    fr: { type: String }
  },
  eventType: { type: String, required: true },
  scientificField: { type: String, required: true },
  theme: { type: String, required: true },
  targetAudience: { type: [String], required: true },
  format: { type: String, required: true },
  location: { type: String,  },
  city: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  submissionDeadline: { type: String },
  subThemeDeadline: { type: String },
  registrationDeadline: { type: String },
  link: { type: String },
  language: { type: String, required: true },
  organizer: { type: String, required: true },
  tags: { type: [String] },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], required: true, default: 'pending' },
  statusBadge: { type: String, enum: ['New', 'Upcoming', 'Closing Soon', "Ended"], default: 'Upcoming' },
  submittedBy: { type: String, required: true },
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
