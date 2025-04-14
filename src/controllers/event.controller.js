import { Event } from "../models/Event.js";

// Create new event
const createEvent = async (req, res) => {
  try {
    
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {   
    res.status(400).json({ error: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.status(201).json({
      success: true,
      message: "Events fetched successfully",
      size: events.length,
      data: events
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAdminEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find().skip(skip).limit(limit);
    const totalEvents = await Event.countDocuments();
    res.status(201).json({
      success: true,
      message: "Events fetched successfully",
      size: totalEvents,
      data: {
        events,
        totalPages: Math.ceil(totalEvents / limit),
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSingleEventPublic = async (req, res) => {
  try {
    const events = await Event.findById(req.params.id);
    res.status(201).json({
      success: true,
      message: "Events fetched successfully",
      data: events,

    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Event deleted successfully",
      data: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Approve an event
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event approved successfully",
      data: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject an event
const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event rejected successfully",
      data: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const EventControllers = {
  createEvent,
  getEvents,
  deleteEvent,
  getAdminEvents,
  getSingleEventPublic,
  approveEvent,
  rejectEvent,
}