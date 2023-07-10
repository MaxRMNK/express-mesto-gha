const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const regex = /^(https?:\/\/)(www\.)?[^\s]*$/;
// ^(https?:\/\/)?(www\.)?[\w\d\.\-\_\~\:\/\?#\[\]@!\$&'\(\)\*\+,;=]+#?$

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Роут (путь, маршрут, эндпоинт) для получения карточек
router.get('/', getCards);

// ______________________________________________
// Роут добавления карточки
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regex).required(),
  }),
}), createCard);

// ______________________________________________
// Роут удаления карточки
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

// ______________________________________________
// Роут добавления лайка
router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

// ______________________________________________
// Роут удаления лайка
router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;

// ------------------------------------------------------------
// // Роут (путь, маршрут, эндпоинт) для получения карточек
// router.get('/', getCards);

// // Роут добавления карточки
// router.post('/', createCard);

// // Роут удаления карточки
// router.delete('/:cardId', deleteCard);

// // Роут добавления лайка
// router.put('/:cardId/likes', likeCard);

// // Роут удаления лайка
// router.delete('/:cardId/likes', dislikeCard);
