const { Schema, model, Types } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const slotSchema = new Schema(
  {
    id: {
      type: String,
      default: uuidv4, 
      unique: true,
    },
    experienceId: {
      type: Types.ObjectId, 
      ref: "Experience",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: "Full Day", 
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


slotSchema.pre("save", function (next) {
  this.isAvailable = this.bookedCount < this.capacity;
  next();
});

module.exports = model("Slot", slotSchema);
