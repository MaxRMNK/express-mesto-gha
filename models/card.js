const mongoose = require('mongoose');
const { isURL } = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина названия 2 символа'],
    maxlength: [30, 'Максимальная длина названия 30 символов'],
  },
  link: {
    type: String,
    required: true,
    // У меня уже была настроена валидация URL с помощью celebrate и регулярки в routes/cards.js
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки на картинку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
