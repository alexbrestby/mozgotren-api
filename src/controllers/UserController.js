require("dotenv").config();
const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserData = require("../models/UserData");

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
      const { ssid } = req.body;
      const userData = await UserData.findOne({ ssid })
      if (!ssid) {
        return res.status(404).send();
      }
      return res.json(userData);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new UserController();
