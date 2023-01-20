const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const app = express();
app.use(express.json());
const Offer = require("../models/Offer");

router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.body.id);
    if (!offer) {
      return res.status(400).json({ message: "Annonce introuvable" });
    }
    res.status(200).json({ message: "Annonce supprimée." });
  } catch (error) {
    res.status(400).json({ message: "erreur" });
  }
});

module.exports = router;
