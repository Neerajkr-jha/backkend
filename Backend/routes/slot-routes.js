const express = require("express");
const router = express.Router();
const Slot = require('../Models/slot');
const Experience = require('../Models/experiences');
const slot = require("../Models/slot");

router.get('/', async (req, res) => {
    try {
        const slots = await Slot.find().populate('experienceId', "title location");
        res.status(200).json(slots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get('/experience/:experienceId', async (req, res) => {
    try {
        const slots = await Slot.find({ experienceId: req.params.experienceId });
        res.status(200).json(slots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/', async (req, res) => {
    try {
        const { experienceId, date, time, capacity } = req.body;

        const experience = await Experience.findById(experienceId);
        if (!experience) {
            res.status(400).json({ error: "Experience not found" })
        }

        const newSlot = new Slot({
            experienceId,
            date,
            time,
            capacity
        })

        await newSlot.save();

        experience.availableSlots.push(newSlot._id);

        await experience.save();
        res.status(200).json({
            message: "slot created sucessfully",
            slot: newSlot,
        })

    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.put('/:id', () => {
    try {
        //have to complete
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports=router;