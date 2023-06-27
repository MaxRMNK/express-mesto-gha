const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Роут (путь, маршрут, эндпоинт) для получения карточек
router.get('/', getCards);

// Роут добавления карточки
router.post('/', createCard);

// Роут удаления карточки
router.delete('/:cardId', deleteCard);

// Роут добавления лайка
router.put('/:cardId/likes', likeCard);

// Роут удаления лайка
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
