import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { morganMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import personRoutes from "./routes/personRoutes.js";

const PORT = process.env.PORT ?? 3001;
const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morganMiddleware);
app.use(express.static("dist"));
// API routes
app.use("/api/persons", personRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT.toString()}`);
});
