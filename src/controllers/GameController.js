require("dotenv").config();
const GameData = require("../models/GameData");

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
      console.log(gameResult);
      return res.json({ message: 'Игра записана', result: gameResult });
    } catch (err) {
      res.status(500).json({ message: 'password update error' });
    }
  }

  async getRatings(req, res) {
    try {
      const rating = await GameData.find({});
      return res.json({ rating });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error retrieving ratings from database');
    }
  }
}

module.exports = new GameController();