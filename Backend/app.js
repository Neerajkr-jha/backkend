require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoute = require('./routes/user-router');
const ExperienceRoute = require('./routes/experiences-routes');
const SlotsRoute = require('./routes/slot-routes');
const BookingRoute = require('./routes/booking-routes');
const PromoCodeRoute = require('./routes/promocode-router');
const { checkForAtuhenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

//  MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


 const FRONTEND_URL = process.env.FRONTEND_URL || 'https://admirable-duckanoo-041bb9.netlify.app';

console.log('🌐 CORS configured for:', FRONTEND_URL); // This will appear in Render logs
//  CORS setup for Netlify + local
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

//  Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAtuhenticationCookie('token'));

// Routes
app.use('/user', userRoute);
app.use('/experiences', ExperienceRoute);
app.use('/slot', SlotsRoute);
app.use('/booking', BookingRoute);
app.use('/promocode', PromoCodeRoute);

//  Root route (for testing)
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render and connected to MongoDB!");
});

//  Start server
app.listen(PORT, () => {
  console.log(` Server started at port ${PORT}`);
});
