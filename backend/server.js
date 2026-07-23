import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routers/userRoute.js';

//App Config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB()

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);

// api endpoints
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Photobooth API is running 🚀"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});