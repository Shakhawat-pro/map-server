import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
// GET user by email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(null);
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
const getPrivateUserByEmail = async (req, res) => {
  const { email } = req.params;
  if (email !== req.decoded.email) {
    return res.status(401).send({ message: 'Unauthorized Access' })
  }


  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(null);
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      // User already exists, so send error response
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    } else {
      // Create new user since they don't exist
      // console.log(req.body);

      user = await User.create(req.body);
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    // console.log('asdfasdfasdfd');

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({
      success: true,
      message: "User removed successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const makeAdminRole = async (req, res) => {
  try {
     console.log('clicked', req.query);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User role updated to admin",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const removeAdminRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: "user" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Admin role removed",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const updateProfile = async (req, res) => {
  // console.log('clicked',req.body)
  const { mobileNumber, address, occupation, profilePicture, name } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { mobileNumber, address, occupation, profilePicture, name },
      { new: true }
    );
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { name, email, role } = req.query;

    // Build dynamic filter object
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // case-insensitive match
    }
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }
    if (role) {
      filter.role = role; // exact match (or you can use regex if needed)
    }

    const users = await User.find(filter).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      size: totalUsers,
      data: {
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};






// Add event to favorites
const addFavorite = async (req, res) => {
  try {
    const { email } = req.params;
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Add to favorites if not already there
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { favorites: eventId } },
      { new: true }
    ).populate('favorites');

    res.status(200).json({
      success: true,
      message: "Event added to favorites",
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add favorite",
      error: error.message
    });
  }
};

// Remove event from favorites
const removeFavorite = async (req, res) => {
  try {
    const { email } = req.params;
    const { eventId } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { favorites: eventId } },
      { new: true }
    ).populate('favorites');

    res.status(200).json({
      success: true,
      message: "Event removed from favorites",
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
      error: error.message
    });
  }
};

// Get user's favorite events
const getFavorites = async (req, res) => {
  try {
    const { email } = req.params;

    if (email !== req.decoded.email) {
      return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const user = await User.findOne({ email }).populate('favorites');

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get favorites",
      error: error.message
    });
  }
};
// Get user's favorite events IDs
const getFavoritesIds = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('favorites');
    const favoriteIds = user.favorites;
    res.status(200).json({
      success: true,
      message: "Favorites IDs retrieved successfully",
      data: favoriteIds
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get favorites IDs",
      error: error.message
    });
  }
}



export const UserController = {
  getUserByEmail,
  getPrivateUserByEmail,
  createUser,
  removeUser,
  makeAdminRole,
  removeAdminRole,
  updateProfile,
  getAllUsers,
  addFavorite,
  removeFavorite,
  getFavorites,
  getFavoritesIds,
}

