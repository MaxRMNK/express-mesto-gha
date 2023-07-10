const mongoose = require('mongoose');
const cardModel = require('../models/card');

const ValidationError = require('../errors/validation-err'); // 400 Bad Request
// const UnauthorizedError = require('../errors/unauthorized-err'); // 401 Unauthorized
const ForbiddenError = require('../errors/forbidden-err'); // 403 Forbidden
const NotFoundError = require('../errors/not-found-err'); // 404 Not Found
// const ConflictError = require('../errors/conflict-err'); // 409 Conflict
// const UnhandledError = require('../errors/unhandled-err'); // 500 Internal Server Error

// Роут получения всех карточек
const getCards = (req, res, next) => {
  cardModel.find({})
    // .orFail(() => {
    //   throw new ValidationError('Некорректный запрос');
    // })
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// Роут создания карточки
// Если в запросе передать действующий токен от пользователя, который уже удален, тогда
// можно создать карточку от его имени. Нужно сделать проверку существования пользователя
// в базе и выбрасывать ошибку если его нет?
const createCard = (req, res, next) => {
  const { _id } = req.user; // ID пользоваля, из токена
  const { name, link } = req.body;

  cardModel.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Ошибка валидации, переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Роут удаления карточки
// Переписать, сделать проще и короче?
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params; // ID удаляемой карточки, из URL
    const { _id } = req.user; // ID пользоваля получаем из токена (в ПР13 был задан в app.js)

    // Ждем пока найдется карточка с таким ID, и идем дальше
    const card = await cardModel.findById(cardId);

    if (card === null) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      const cardOwnerId = card.owner.toString();

      // Проверяем является ли пользователь, который пытается удалить карточку, ее владельцем.
      if (_id === cardOwnerId) {
        // Удаляем карточку; отправляем код состояния и сообщение
        cardModel.deleteOne(card)
          .then(() => res.status(200).send({
            message: 'Карточка успешно удалена',
          }))
          .catch(next);
      } else {
        // Выдаем ошибку, если карточку удаляет не тот пользователь, который ее создал
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new ValidationError('Некорректный ID карточки'));
    } else {
      next(err);
    }
  }
};

// !!! НЕ ЭКСПОРТИРОВАТЬ
// Роут обновления карточки
// Надо ли проверять, есть или нет у карточки лайк? Сейчас статус 200 даже если "ставится" лайк,
// когда он уже есть, или "убирается" когда его и нет.
const updateCard = (req, res, next, likeData) => {
  const { cardId } = req.params; // ID карточки которой ставится/удаляется лайк, из URL

  cardModel.findByIdAndUpdate(
    cardId,
    likeData,
    { new: true },
  )
    .orFail(() => { // Если карточка с таким ID не найдена - выбрасывается ошибка
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError('Некорректный ID карточки'));
      } else {
        next(err);
      }
    });
};

// Роут обновления карточки - поставить лайк
const likeCard = (req, res, next) => {
  const { _id } = req.user; // ID пользоваля, из токена
  updateCard(req, res, next, { $addToSet: { likes: _id } });
};

// Роут обновления карточки - убрать лайк
const dislikeCard = (req, res, next) => {
  const { _id } = req.user; // ID пользоваля, из токена
  updateCard(req, res, next, { $pull: { likes: _id } });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
