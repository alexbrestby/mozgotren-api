const { Schema, model } = require('mongoose');

const GameData = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameTime: { type: Date, default: Date(now) },
  score: { type: String },
  gameQntCounter: { type: String },
  gameTotalTimer: { type: String }
})

module.exports = model('GameData', GameData);