import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      "Too many authentication attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

connectDB();

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/student", studentRoutes);

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
