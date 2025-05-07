import express from "express";
import { EventControllers } from "../controllers/event.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", EventControllers.createEvent);
router.get("/", EventControllers.getEvents);
router.get('/coordinates', EventControllers.getEventCoordinates);
router.get("/adminEvents", verifyToken, verifyAdmin, EventControllers.getAdminEvents);

router.get("/userEvents/:email", EventControllers.getUserEvents);
router.delete("/:id", verifyToken, verifyAdmin, EventControllers.deleteEvent);
router.get("/:id", EventControllers.getSingleEventPublic);
router.patch("/approve/:id", verifyToken, verifyAdmin, EventControllers.approveEvent);
router.patch("/reject/:id", verifyToken, verifyAdmin, EventControllers.rejectEvent);
router.patch("/updateEventStatus/:id", verifyToken, verifyAdmin, EventControllers.updateEventStatus);
router.patch("/statusBadge/:id", verifyToken, verifyAdmin, EventControllers.updateStatusBadge);
router.patch("/:id", EventControllers.editEvent);
router.patch("/admin/:id", verifyToken, verifyAdmin, EventControllers.editEventAdmin);

router.delete("/deleteEvent/:id", verifyToken, EventControllers.deleteUserEvent);




export  const eventRouter = router;
