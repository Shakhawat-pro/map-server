import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.Routes.js";
import { eventRouter } from "./routes/event.routes.js";
import { homePageRouter } from "./routes/homePage.routes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middleware
const allowedOrigins = ["http://localhost:5173", "https://confmap.fr"];
// app.use(cors({ credentials: true, origin: "http://localhost:5173" })); 
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());
app.use(cookieParser());

// Favicon fix (optional, prevents 404 logs)
app.get('/favicon.ico', (req, res) => res.sendStatus(204));


// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);
app.use("/api/homePage", homePageRouter);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DATABASE_URL, {})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB Connection Error:", err));
