const { Schema, model } = require('mongoose');

const GameData = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: { type: Number, default: null },
  score: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  date: { type: Date, default: new Date() },
  rightAnswers: { type: Number },
  wrongAnswers: { type: Number },
})

module.exports = model('GameData', GameData);