require("dotenv").config();
const User = require("../models/User.js");
const GameData = require("../models/GameData.js");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserData = require("../models/UserData");
const { findByIdAndUpdate } = require("../models/User.js");

class UserController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Ошибка при регистрации",
          errors,
        });
      }
      const { username, password, email } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({
          message: "Пользователь с таким именем уже существует",
        });
      }
      const candidateMail = await User.findOne({ email });
      if (candidateMail) {
        return res.status(400).json({
          message: "Пользователь с таким email уже существует",
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ username, password: hashPassword, email: email });
      const userData = new UserData({ userId: user._id, oldEmail: email });
      await user.save();
      await userData.save();
      return res.json({
        message: "Пользователь успешно зарегистрирован",
      });
    } catch (e) {
      console.log(e)
      res.status(400).json({
        message: 'Registration error',
      });
    }
  }

  async login(req, res) {
    try {
      const { password, email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: `Пользователь с email <b>${email}</b> не найден`,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: `Введен неверный пароль`,
        });
      }
      return res.json({
        messsage: 'Вы вошли в систему',
        user: user.username,
        ssid: user._id,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        message: 'Login error',
      });
    }
  }

  async checkRegistration(req, res) {
    try {
      const { ssid } = req.body;
      const ssidDB = await User.findById(ssid);
      if (!ssidDB) {
        return res.json({
          message: 'You are not autenticated',
          status: false,
          user: null,
        });
      }
      if (ssid === ssidDB.id) {
        return res.json(
          {
            message: 'You are authenticated',
            status: true,
            user: ssidDB.username,
            email: ssidDB.email,
          });
      } else {
        return res.json({
          message: 'You are not authenticated',
          status: false,
          user: null,
        });
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({
        message: 'Check registration error',
      });
    }
  }

  async getUserData(req, res) {
    try {
      let { ssid } = req.body;
      const userData = await UserData.find({ userId: ssid });
      if (!ssid) {
        return res.status(404).send();
      }
      GameData.find({ userId: ssid })
        .sort({ time: -1 })
        .exec(function (err, results) {
          if (err) return console.error(err);
          return res.json({ userObj: userData[0], prefferedGameId: results[0].gameId, gamesCounter: results.length });
        });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async uploadUserData(req, res) {
    try {
      const { userId, username, userProfession, country, birdthDate } = req.body;
      console.log(req.body);
      console.log(req.file);
      const responseArray = [];
      if (typeof username !== 'undefined') {
        responseArray.push('имя пользователя обновлено');
        await User.findByIdAndUpdate(
          userId,
          {
            $set: { username }
          });
      }
      if (req.file !== undefined && req.file.fieldname === 'image') {
        const { path } = req.file;
        responseArray.push('фотография профиля обновлена');
        await UserData.findOneAndUpdate(
          { userId: userId },
          {
            $set: { imagePath: path }
          });
      }
      if (typeof userProfession !== 'undefined') {
        responseArray.push('профессия пользователя обновлена');
        await UserData.findOneAndUpdate(
          { userId: userId },
          {
            $set: { profession: userProfession }
          });

      }
      if (typeof country !== 'undefined') {
        responseArray.push('страна обновлена');
        await UserData.findOneAndUpdate(
          { userId: userId },
          {
            $set: { country: country }
          });
      }
      if (typeof birdthDate !== 'undefined') {
        responseArray.push('день рождения обновлен');
        await UserData.findOneAndUpdate(
          { userId: userId },
          {
            $set: { birdthDate: birdthDate },
          });
      }
      res.send(responseArray);
    } catch (error) {
      res.status(500).json({ message: 'form handle error' });
    }
  }

  async updatePassword(req, res) {
    const { ssid, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 7);
    try {
      console.log(ssid);
      const result = await User.findByIdAndUpdate(
        ssid,
        { $set: { password: hashPassword } });
      res.json({
        message: "Пароль успешно обновлен",
      });
    } catch (err) {
      res.status(500).json({ message: 'password update error' });
    }
  }
}

module.exports = new UserController();
