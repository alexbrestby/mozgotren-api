const { Schema, model } = require('mongoose');

const UserData = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  oldEmail: { type: String },
  age: { type: String, default: null },
  regTime: { type: Date, default: Date.now() },
  birdthDate: { type: String, default: null },
  profession: { type: String, default: null },
  accStatus: { type: String, default: 'Базовый' },
  prefferedGame: { type: String, default: null }
})

module.exports = model('UserData', UserData);