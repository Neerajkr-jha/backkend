const { Schema, model } = require("mongoose");

const promoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, 
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"], 
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = model("PromoCode", promoCodeSchema);
