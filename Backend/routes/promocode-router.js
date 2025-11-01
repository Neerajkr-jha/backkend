const express = require("express");
const router = express.Router();
const PromoCode = require("../Models/promocode");

router.get("/", async (req, res) => {
  try {
    const codes = await PromoCode.find({ isActive: true });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch promo codes" });
  }
});

router.post("/apply", async (req, res) => {
  try {
    const { code, total } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) return res.status(404).json({ error: "Invalid or inactive promo code" });

    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      return res.status(400).json({ error: "Promo code expired" });
    }

    let discountedTotal = total;
    if (promo.discountType === "percentage") {
      discountedTotal = total - (total * promo.discountValue) / 100;
    } else if (promo.discountType === "flat") {
      discountedTotal = Math.max(0, total - promo.discountValue);
    }

    res.json({ 
      success: true,
      discountedTotal,
      message: `Promo applied! You saved ${promo.discountType === "percentage" ? promo.discountValue + "%" : "₹" + promo.discountValue}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error applying promo" });
  }
});


router.post('/', async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, isActive } = req.body;

    const newCode = new PromoCode({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      isActive,
    });
    res.status(201).json({ message: "Promo code added successfully", promocode: newCode });
  } catch (error) {
    console.error("Error adding promocode:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return res.status(404).json({ error: "Invalid or inactive promo code" });
    }


    if (promo.expiryDate && promo.expiryDate < new Date()) {
      return res.status(400).json({ error: "Promo code has expired" });
    }


    res.status(200).json({
      message: "Promo code is valid ",
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
