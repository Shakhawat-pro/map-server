import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.Routes.js";
import { eventRouter } from "./routes/event.routes.js";
import { homePageRouter } from "./routes/homePage.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

dotenv.config({ path: '/var/www/backend/.env' })

const app = express();
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Middleware
const allowedOrigins = [
  "http://localhost:5173", 
  "https://confmap.fr", 
  "https://www.confmap.fr",
  "http://69.62.105.179"  // Add your IP if needed
];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      return origin === allowed || 
             origin.includes(allowed.replace(/https?:\/\//, ''));
    })) {
      return callback(null, true);
    }
    
    console.log("Origin not allowed by CORS:", origin);
    callback(new Error("Not allowed by CORS"));
  }
}));

app.use(express.json());
app.use(cookieParser());

// Favicon fix (optional, prevents 404 logs)
app.get('/favicon.ico', (req, res) => res.sendStatus(204));




// Add this before your routes
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});


// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// Add this before other routes
app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!" });
});

// Add this explicit route handler
app.get('/api/', (req, res) => {
  res.json({ 
      message: "API root endpoint",
      availableRoutes: [
          "/api/test",
          "/api/events",
          "/api/users",
          "/api/homePage",
          "/api/admin"
      ]
  });
});

app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);
app.use("/api/homePage", homePageRouter);
app.use("/api/admin", adminRouter);

console.log("Database URL:", process.env.DATABASE_URL); // Debugging step


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DATABASE_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB Connection Error:", err));
