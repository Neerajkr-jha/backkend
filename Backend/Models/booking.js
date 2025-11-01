const { Schema, model, Types } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookingSchema = new Schema(
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
    slotId: {
      type: Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User", 
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    numGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    promoCode: {
      type: String,
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (!this.status) this.status = "confirmed";
  next();
});

module.exports = model("Booking", bookingSchema);
