const mongoose = require('mongoose');
// Для сокращения размера дистрибутива, подключаются только используемые библиотеки:
// const { isURL } = require('validator'); // 112.6k
const isURL = require('validator/lib/isURL');

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
    /** да, я видел вашу валидацию через joi
     * Очень хорошо, что вынесли валидаторы в отдельные файлы и валидируем переданные значения
     * с помощью joi. Здесь мы валидируемся на стороне роутеров и контроллеров, а не на стороне
     * модели БД, в зависимости от потребности бизнеса мы можем варьировать нашими валидаторами.
     * Но раз мы здесь начали валидировать, то так же можно сразу указать проверить что link
     * например - обязателен и проверить его на валидную ссылку, joi это хорошо умеет делать
     * тоже тут больше вопрос про то чтобы мы научились применять валидацию на всех уровнях */
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
