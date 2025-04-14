import express from "express";
import { Deadline, PopularTopic, UpcomingEvent } from "../models/homePage.js";

const router = express.Router();

// Helper function for response formatting
const sendResponse = (res, success, message, data = null, code = 200) => {
  res.status(code).json({
    success,
    message,
    data,
  });
};

// Deadline routes
router.get('/deadlines', async (req, res) => {
  try {
    const deadlines = await Deadline.find();
    sendResponse(res, true, "Deadlines fetched successfully", deadlines);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
});

router.post('/deadlines', async (req, res) => {
  try {
    const deadline = await Deadline.create(req.body);
    sendResponse(res, true, "Deadline created successfully", deadline, 201);
  } catch (error) {
    sendResponse(res, false, error.message, null, 400);
  }
});

router.delete('/deadlines/:id', async (req, res) => {
  try {
    const deleted = await Deadline.findByIdAndDelete(req.params.id);
    deleted
      ? sendResponse(res, true, "Deadline deleted successfully", deleted)
      : sendResponse(res, false, "Deadline not found", null, 404);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
});




// Upcoming Events
router.get('/upcoming-events', async (req, res) => {
  try {
    const events = await UpcomingEvent.find();
    sendResponse(res, true, "Upcoming events fetched successfully", events);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
});

router.post('/upcoming-events', async (req, res) => {
  try {
    const event = await UpcomingEvent.create(req.body);
    sendResponse(res, true, "Upcoming event created successfully", event, 201);
  } catch (error) {
    sendResponse(res, false, error.message, null, 400);
  }
});

router.delete('/upcoming-events/:id', async (req, res) => {
  try {
    const deleted = await UpcomingEvent.findByIdAndDelete(req.params.id);
    deleted
      ? sendResponse(res, true, "Upcoming event deleted successfully", deleted)
      : sendResponse(res, false, "Upcoming event not found", null, 404);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
});

// Popular Topics
router.get('/popular-topics', async (req, res) => {
  try {
    const topics = await PopularTopic.find();
    sendResponse(res, true, "Popular topics fetched successfully", topics);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
});

router.post('/popular-topics', async (req, res) => {
  try {
    const topic = await PopularTopic.create(req.body);
    sendResponse(res, true, "Popular topic created successfully", topic, 201);
  } catch (error) {
    sendResponse(res, false, error.message, null, 400);
  }
});

router.delete('/popular-topics/:id', async (req, res) => {
  try {
    const deleted = await PopularTopic.findByIdAndDelete(req.params.id);
    deleted
      ? sendResponse(res, true, "Popular topic deleted successfully", deleted)
      : sendResponse(res, false, "Popular topic not found", null, 404);
  } catch (error) {
    sendResponse(res, false, error.message, null, 500);
  }
});

export const homePageRouter = router;
