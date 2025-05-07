import mongoose from "mongoose";

export const Deadline = mongoose.model('Deadline', new mongoose.Schema({
    title: {
        en: { type: String },
        fr: { type: String}
    },
    date: { type: String}
}));

export const UpcomingEvent = mongoose.model('UpcomingEvent', new mongoose.Schema({
    title:  {
        en: { type: String },
        fr: { type: String}
    },
    date: { type: String}
}));

export const PopularTopic = mongoose.model('PopularTopic', new mongoose.Schema({
    title:  {
        en: { type: String },
        fr: { type: String}
    }
}));

