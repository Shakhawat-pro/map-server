import express from "express";
import { adminController } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();


router.get("/isAdmin", verifyToken,  adminController.isAdmin);
router.get("/dashboard-stats", adminController.getDashboardStats);

export const adminRouter = router;
