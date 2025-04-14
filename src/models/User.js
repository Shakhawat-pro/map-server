import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  profilePicture: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  mobileNumber: String,
  address: String,
  occupation: String,
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
});


export const User = mongoose.model("User", userSchema);
