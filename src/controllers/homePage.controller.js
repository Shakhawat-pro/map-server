import { Deadline, UpcomingEvent, PopularTopic } from "../models/homePage.js";

// Create new deadline
const createDeadline = async (req, res) => {
  try {
    const { title, deadline } = req.body;
    const newDeadline = await Deadline.create({ title, deadline });
    res.status(201).json({
      success: true,
      message: "Deadline created successfully",
      data: newDeadline
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all deadlines
const getDeadlines = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const deadlines = await Deadline.find()
      .skip(skip)
      .limit(limit);
    const total = await Deadline.countDocuments();

    res.status(200).json({
      success: true,
      message: "Deadlines fetched successfully",
      data: deadlines,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new upcoming event
const createUpcomingEvent = async (req, res) => {
  try {
    const { title, date } = req.body;
    const newEvent = await UpcomingEvent.create({ title, date });
    res.status(201).json({
      success: true,
      message: "Upcoming event created successfully",
      data: newEvent
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const events = await UpcomingEvent.find()
      .skip(skip)
      .limit(limit);
    const total = await UpcomingEvent.countDocuments();

    res.status(200).json({
      success: true,
      message: "Upcoming events fetched successfully",
      data: events,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new popular topic
const createPopularTopic = async (req, res) => {
  try {
    const { title } = req.body;
    const newTopic = await PopularTopic.create({ title });
    res.status(201).json({
      success: true,
      message: "Popular topic created successfully",
      data: newTopic
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all popular topics
const getPopularTopics = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const topics = await PopularTopic.find()
      .skip(skip)
      .limit(limit);
    const total = await PopularTopic.countDocuments();

    res.status(200).json({
      success: true,
      message: "Popular topics fetched successfully",
      data: topics,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const HomePageController = {
  createDeadline,
  getDeadlines,
  createUpcomingEvent,
  getUpcomingEvents,
  createPopularTopic,
  getPopularTopics
};