const { Schema, model, Types } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const experiencesSchema = new Schema(
    {
        id: {
            type: String,
            default: uuidv4, 
            unique: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            default: "general", // optional field
        },
        availableSlots: [
            {
                type: Types.ObjectId, 
                ref: "Slot",
            },
        ],
    },
    { timestamps: true }
);

module.exports = model("Experience", experiencesSchema);
