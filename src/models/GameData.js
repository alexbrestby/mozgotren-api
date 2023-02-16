const { Schema, model } = require('mongoose');

const GameData = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: { type: Number },
  score: { type: Number },
  time: { type: Number },
  date: { type: Date, default: new Date() },
  rightAnswers: { type: Number },
  wrongAnswers: { type: Number },
})

module.exports = model('GameData', GameData);