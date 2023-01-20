const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.body;
    const search = await User.findOne({ email: email });
    if (search) {
      return res.status(400).json("This email is already registered.");
    }
    if (!username) {
      return res.status(400).json("Please give an username.");
    }
    const salt = uid2(16);
    const hash = SHA256(salt + password).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      account: {
        username,
      },
      email,
      //password: password, ON ENREGISTRE ===> JAMAIS <=== LE MDP DANS LA BDD
      newsletter,
      token,
      hash,
      salt,
    });
    await newUser.save();
    const response = {
      _id: newUser._id,
      account: newUser.account,
      token: token,
      newsletter: newsletter,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
