import express from "express";
import { EventControllers } from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", EventControllers.createEvent);
router.get("/", EventControllers.getEvents);
router.get("/adminEvents", EventControllers.getAdminEvents);
router.delete("/:id", EventControllers.deleteEvent);
router.get("/:id", EventControllers.getSingleEventPublic);
router.patch("/approve/:id", EventControllers.approveEvent);
router.patch("/reject/:id", EventControllers.rejectEvent);

export  const eventRouter = router;
