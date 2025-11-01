const express = require("express");
const router = express.Router();
const Experience = require('../Models/experiences');

router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().populate("availableSlots");
        res.status(200).json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const experiences = await Experience.findOne({ id: req.params.id }).populate("availableSlots");
        if (!Experience) {
            res.status(404).json({ error: "Experience not found" })
        }
        res.status(200).json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/', async (req, res) => {
    try {
        const newExperience = new Experience(req.body);
        await newExperience.save();
        res.status(201).json({ message: "Experience created successfully", experience: newExperience });
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports=router;