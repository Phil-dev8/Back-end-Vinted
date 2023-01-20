const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");
const fileUpload = require("express-fileupload");
const app = express();
app.use(express.json());
//const convertToBase64 = require("../utils/convertToBase64"); // pour image
//const cloudinary = require("cloudinary").v2; // pour image
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        //product_image: result,  pour image
        owner: req.user,
      });
      //Si l'annonce comporte une photo, ajoutez ces lignes:
      //const result = await cloudinary.uploader.upload(
      // convertToBase64(req.files.picture)
      // );
      //newOffer.product_image = result;
      await newOffer.save();
      res.status(200).json(newOffer);
    } catch (error) {
      res.status(400).json({ message: "Une erreur est survenue." });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;
    const filters = {};
    if (title) {
      filters.product_name = new RegExp(title, "i");
    }
    if (priceMin) {
      filters.product_price = { $gte: Number(priceMin) };
    }
    if (priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = Number(priceMax);
      } else {
        filters.product_price = { $lte: Number(priceMax) };
      }
    }
    const sortFilter = {};

    if (sort === "price-asc") {
      sortFilter.product_price = "asc";
    } else if (sort === "price-desc") {
      sortFilter.product_price = "desc";
    }

    const limit = 5;
    let pageRequired = 1;

    if (page) {
      pageRequired = Number(page);
    }
    const skip = (pageRequired - 1) * limit;

    const offers = await Offer.find(filters)
      .sort(sortFilter)
      .skip(skip)
      .limit(limit)
      .populate("owner", "account");
    const count = await Offer.countDocuments(filters);
    const response = {
      count: count,
      offers: offers,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

router.get("/offer/:id", async (req, res) => {
  try {
    const params = req.params.id;
    const offerId = await Offer.findById(params).select("product_name");
    res.status(200).json(offerId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
