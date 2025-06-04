import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}
app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

// API routes
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  const staticPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));

  // Any request that doesn't match API routes should go to index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
