import express from "express";
import { UserController } from "../controllers/user.controller.js";
import dotenv from "dotenv";
import { verifyToken } from "../middlewares/verifyToken.js";
import jwt from "jsonwebtoken";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY 
  );
  

const router = express.Router();

// ✅ Secure JWT issuing route
router.post('/jwt', async (req, res) => {
    const { supabaseToken } = req.body;
    console.log(supabaseToken);
    
  
    if (!supabaseToken) return res.status(401).json({ error: 'Missing Supabase token' });
  
    // Validate token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(supabaseToken);
    if (error || !user) return res.status(403).json({ error: 'Invalid Supabase token' });
  
    const userEmail = user.email;
  
    // Optional: Check or create user in MongoDB here if needed
  
    const token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET, { expiresIn: '12h' });
  
    res.json({ token });
  });
  
router.post("/create-user", UserController.createUser);
router.get("/:email", UserController.getUserByEmail);
router.get("/private/:email", verifyToken, UserController.getPrivateUserByEmail);
router.patch("/profile/:email", UserController.updateProfile);

// Favorite routes
router.post("/:email/favorites", UserController.addFavorite);
router.delete("/:email/favorites", UserController.removeFavorite);
router.get("/:email/favorites", verifyToken, UserController.getFavorites);
router.get("/:email/favoritesIds", UserController.getFavoritesIds);

// Admin
router.get("/", verifyToken, verifyAdmin, UserController.getAllUsers);
router.patch("/role/admin/:id", verifyToken, verifyAdmin, UserController.makeAdminRole);
router.patch("/role/guest/:id", verifyToken, verifyAdmin, UserController.removeAdminRole);
router.delete("/:id", verifyToken, verifyAdmin, UserController.removeUser);



export const userRouter = router;
