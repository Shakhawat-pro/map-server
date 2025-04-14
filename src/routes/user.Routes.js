import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/create-user", UserController.createUser);
router.get("/:email", UserController.getUserByEmail);
router.get("/", UserController.getAllUsers);
router.delete("/:id", UserController.removeUser);
router.patch("/role/admin/:id", UserController.makeAdminRole);
router.patch("/role/user/:id", UserController.removeAdminRole);
router.patch("/profile/:id", UserController.updateProfile);

// Favorite routes
router.post("/:userId/favorites/:eventId", UserController.addFavorite);
router.delete("/:userId/favorites/:eventId", UserController.removeFavorite);
router.get("/:userId/favorites", UserController.getFavorites);

export const userRouter = router;
