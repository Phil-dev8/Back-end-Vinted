require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const app = express();
const cors = require("cors");
const signIn = require("./routes/signin");
const login = require("./routes/login");
const offers = require("./routes/offers");
const deleteOffer = require("./routes/delete");
app.use(signIn);
app.use(login);
app.use(offers);
app.use(deleteOffer);
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLODUINARY_API_SECRET,
  secure: true,
});
// je créer une route de bienvenue
app.get("/", (req, res) => {
  res.json("Bienvenue sur mon serveur🚀");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started ✅");
});
