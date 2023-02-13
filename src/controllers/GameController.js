require("dotenv").config();
const User = require("../models/User.js");
const GameData = require("../models/GameData");
const { validationResult } = require('express-validator');

class GameController {

  async getAll(req, res, next) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(404).send();
      }
      return res.json(user)
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new GameController();