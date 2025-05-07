import axios from "axios";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";

// DeepL API Key
const DEEPL_API_KEY = "320c0373-fc84-4bdc-bb18-b0cbfb27cba8:fx";

const translateText = async (text, targetLang) => {
  const response = await axios.post(
    "https://api-free.deepl.com/v2/translate",
    new URLSearchParams({
      auth_key: DEEPL_API_KEY,
      text,
      target_lang: targetLang,
    })
  );
  return response.data.translations[0].text;  // Return only the translated text
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, description, detailDescription } = req.body;

    let newEvent = { ...req.body };

    // When the input is in English
    const titleTranslation = {
      en: await translateText(title, "EN"),  // Save English
      fr: await translateText(title, "FR")  // Save French 
    }

    const descTranslation = {
      en: await translateText(description, "EN"),  // Save English
      fr: await translateText(description, "FR")  // Save French 
    }

    const detailDescTranslation = {
      en: await translateText(detailDescription, "EN"),  // Save English
      fr: await translateText(detailDescription, "FR")  // Save French 
    }

    // Save translations in the event object
    newEvent.title = titleTranslation;
    newEvent.description = descTranslation;
    newEvent.detailDescription = detailDescTranslation;

    const event = await Event.create(newEvent);

    res.status(201).json({
      success: true,
      message: "Event created successfully with translations",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ error: error.message });
  }
};



// Get all events
const getEvents = async (req, res) => {
  try {
    const {
      searchQuery,
      location,
      eventType,
      field,
      startDate,
      endDate,
      format,
      tags,
      page = 1,
      limit = 10
    } = req.query;
    // console.log(req.query);

    const query = { status: "approved" };

    // Search title.en or description.en
    if (searchQuery) {
      const escapedQuery = searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape special characters
      const wordRegex = new RegExp(`\\b${escapedQuery}\\b`, 'i'); // \b word boundary

      query.$or = [
        { "title.en": wordRegex },
        { "title.fr": wordRegex },
        { "description.en": wordRegex },
        { "description.fr": wordRegex }
      ];
    }

    // Location search (location or city)
    if (location) {
      const locationRegex = { $regex: location, $options: "i" };
      query.$or = query.$or || [];
      query.$or.push(
        { location: locationRegex },
        { city: locationRegex }
      );
    }

    // Event type filter
    if (eventType) {
      query.eventType = eventType;
    }

    // Scientific field filter
    if (field) {
      query.scientificField = field;
    }


    // 🔥 Date range filter (string comparison)
    if (startDate && endDate) {
      query.startDate = { $lte: endDate };  // Event must start before or at the endDate
      query.endDate = { $gte: startDate };  // Event must end after or at the startDate
    } else if (startDate) {
      query.endDate = { $gte: startDate };
    } else if (endDate) {
      query.startDate = { $lte: endDate };
    }

    // Format filter
    if (format) {
      query.format = format;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * limitNumber;

    // Query
    const [events, total, totalEvents] = await Promise.all([
      Event.find(query).skip(skip).limit(limitNumber),
      Event.countDocuments(query),
      Event.countDocuments({ status: "approved" })
    ]);


    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      size: totalEvents,
      data: events,
      pagination: {
        total,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const getEventCoordinates = async (req, res) => {
  try {
    const events = await Event.find(
      {
        status: "approved",
        coordinates: { $exists: true, $ne: null }
      },
      {
        _id: 1,
        title: 1,
        coordinates: 1,
      }
    );

    res.status(200).json({
      success: true,
      data: events.map(event => ({
        id: event._id,
        title: event.title,
        location: event.location || event.city,
        date: event.startDate,
        coordinates: event.coordinates
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAdminEvents = async (req, res) => {
  try {
    // console.log("event");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title, status, statusBadge } = req.query; // <-- get filters

    const query = {};

    if (title) {
      query['title.en'] = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    if (status) {
      query.status = status;
    }
    if (statusBadge) {
      query.statusBadge = statusBadge;
    }

    const events = await Event.find(query)
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      size: totalEvents,
      data: {
        events,
        totalPages: Math.ceil(totalEvents / limit),
      }
    });
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
    const eventId = req.params.id;

    // Delete the Event
    await Event.findByIdAndDelete(eventId);

    // Remove the eventId from all users' favorites arrays
    await User.updateMany(
      { favorites: eventId },
      { $pull: { favorites: eventId } }
    );

    res.json({
      success: true,
      message: "Event deleted successfully and removed from user favorites",
      data: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserEvent = async (req, res) => {
  try {

    const email = req.query.email

    if (email !== req.decoded.email) {
      return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const eventId = req.params.id;

    // Delete the Event
    await Event.findByIdAndDelete(eventId);

    // Remove the eventId from all users' favorites arrays
    await User.updateMany(
      { favorites: eventId },
      { $pull: { favorites: eventId } }
    );

    res.json({
      success: true,
      message: "Event deleted successfully and removed from user favorites",
      data: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Approve an event
const approveEvent = async (req, res) => {
  try {
    // console.log("approved Event");

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

// Edit an event
const editEvent = async (req, res) => {
  try {
    const { title, description, detailDescription } = req.body;

    let newEvent = { ...req.body };

    // When the input is in English
    const titleTranslation = {
      en: await translateText(title, "EN"),  // Save English
      fr: await translateText(title, "FR")  // Save French 
    }

    const descTranslation = {
      en: await translateText(description, "EN"),  // Save English
      fr: await translateText(description, "FR")  // Save French 
    }

    const detailDescTranslation = {
      en: await translateText(detailDescription, "EN"),  // Save English
      fr: await translateText(detailDescription, "FR")  // Save French 
    }

    // Save translations in the event object
    newEvent.title = titleTranslation;
    newEvent.description = descTranslation;
    newEvent.detailDescription = detailDescTranslation;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      newEvent,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit an event
const editEventAdmin = async (req, res) => {
  try {
    console.log("edit event admin");

    const email= req.query.email
    if (email !== req.decoded.email) {
      return res.status(401).send({ message: 'Unauthorized Access' })
    }
    
    const { title, description, detailDescription } = req.body;

    let newEvent = { ...req.body };

    // When the input is in English
    const titleTranslation = {
      en: await translateText(title, "EN"),  // Save English
      fr: await translateText(title, "FR")  // Save French 
    }

    const descTranslation = {
      en: await translateText(description, "EN"),  // Save English
      fr: await translateText(description, "FR")  // Save French 
    }

    const detailDescTranslation = {
      en: await translateText(detailDescription, "EN"),  // Save English
      fr: await translateText(detailDescription, "FR")  // Save French 
    }

    // Save translations in the event object
    newEvent.title = titleTranslation;
    newEvent.description = descTranslation;
    newEvent.detailDescription = detailDescTranslation;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      newEvent,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateEventStatus = async (req, res) => {
  console.log('clicked');

  const { id } = req.params;
  const { status } = req.body;

  console.log(status);

  const allowedStatuses = ['approved', 'rejected', 'pending'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({
      success: true,
      error: 'Event not found'
    });

    res.status(200).json({
      success: true,
      message: `Event status updated to ${status} successfully`,
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      error: 'Server error'
    });
  }
};



const updateStatusBadge = async (req, res) => {
  // console.log('clicked');

  const { id } = req.params;
  const { statusBadge } = req.body;

  const allowedStatuses = ['New', 'Upcoming', 'Closing Soon', 'Ended'];
  if (!allowedStatuses.includes(statusBadge)) {
    return res.status(400).json({ error: 'Invalid statusBadge value' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { statusBadge },
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });

    res.json({ message: 'Status updated successfully', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



// Get events by user email
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ submittedBy: req.params.email });
    res.status(200).json({
      success: true,
      message: "User events fetched successfully",
      size: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const EventControllers = {
  createEvent,
  getEvents,
  deleteEvent,
  deleteUserEvent,
  getAdminEvents,
  getSingleEventPublic,
  approveEvent,
  rejectEvent,
  updateEventStatus,
  updateStatusBadge,
  getUserEvents,
  editEvent,
  editEventAdmin,
  getEventCoordinates,
}