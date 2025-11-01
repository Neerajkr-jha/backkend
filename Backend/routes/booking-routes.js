const express = require("express");
const router = express.Router();
const Booking = require("../Models/booking");
const Slot = require("../Models/slot");
const Experience = require("../Models/experiences");
const User = require("../Models/user");


router.post("/", async (req, res) => {
  try {
    const { userId, experienceId, slotId, fullname, email, numGuests, promoCode } = req.body;

    const slot = await Slot.findById(slotId);
    const experience = await Experience.findById(experienceId);
    const user = await User.findById(userId);

    if (!slot || !experience || !user) {
      return res.status(404).json({ error: "Invalid slot, experience, or user" });
    }

    if (slot.bookedCount + numGuests > slot.capacity) {
      return res.status(400).json({ error: "Slot is full or not enough seats available" });
    }


    let totalPrice = experience.price * numGuests;

    
    if (promoCode === "SAVE10") totalPrice *= 0.9;
    if (promoCode === "FLAT100") totalPrice -= 100;
    if (totalPrice < 0) totalPrice = 0;

   
    const booking = new Booking({
      userId,
      experienceId,
      slotId,
      fullname,
      email,
      numGuests,
      promoCode,
      totalPrice,
      status: "confirmed",
    });

    await booking.save();

    
    slot.bookedCount += numGuests;
    if (slot.bookedCount >= slot.capacity) slot.isAvailable = false;
    await slot.save();

    
    res.status(201).json({
      message: "Booking successful ",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
