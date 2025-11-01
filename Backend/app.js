require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const cors = require('cors');


const userRoute = require('./routes/user-router');
const ExperienceRoute = require('./routes/experiences-routes');
const SlotsRoute = require('./routes/slot-routes');
const BookingRoute = require('./routes/booking-routes');
const PromoCodeRoute = require('./routes/promocode-router');

const { checkForAtuhenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

//mongoose connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB connected"));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.resolve("./public")));

app.use(checkForAtuhenticationCookie('token'));

app.use('/user', userRoute);
app.use('/experiences',ExperienceRoute);
app.use('/slot',SlotsRoute);
app.use('/booking',BookingRoute);
app.use('/promocode',PromoCodeRoute);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});