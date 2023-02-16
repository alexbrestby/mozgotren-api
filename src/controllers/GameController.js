require("dotenv").config();
const GameData = require("../models/GameData");
const User = require("../models/User");

class GameController {

  async sendResult(req, res) {
    const {
      userId,
      gameId,
      score,
      time,
      date,
      rightAnswers,
      wrongAnswers,
    } = req.body;
    console.log(req.body);
    try {
      const gameResult = new GameData({
        userId,
        gameId,
        score,
        time,
        date,
        rightAnswers,
        wrongAnswers,
      });
      await gameResult.save();
      return res.json({ message: 'Игра записана', result: gameResult });
    } catch (err) {
      res.status(500).json({ message: 'game result update error' });
    }
  }

  async getRatings(req, res) {
    try {
      await GameData.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        }
      ], function (err, result) {
        if (err) {
          console.log(err);
        }
        return res.json({ result });
      });
    } catch (error) {
      res.status(500).send('Error retrieving ratings from database');
    }
  }
}

module.exports = new GameController();