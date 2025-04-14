import mongoose from "mongoose";

export const Deadline = mongoose.model('Deadline', new mongoose.Schema({
    title: String,
    deadline: String
}));

export const UpcomingEvent = mongoose.model('UpcomingEvent', new mongoose.Schema({
    title: String,
    date: String
}));

export const PopularTopic = mongoose.model('PopularTopic', new mongoose.Schema({
    title: String
}));

