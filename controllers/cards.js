const cardModel = require('../models/card');
const errors = require('../routes');

// const ERROR_BAD_REQUEST = 400;
// const ERROR_ACCESS_DENIDED = 403;
// const ERROR_NOT_FOUND = 404;
// const ERROR_DEFAULT = 500;

const getCards = (req, res) => {
  cardModel.find({})
    // Добавил "статус 200" т.к. в вебинаре препод сказал, что явно его указывать - хороший тон.
    .then((cards) => res.status(200).send(cards))
    // Почему-то на проверку ушла предпоследняя редакция, в последней статусы уже были исправлены.
    // Надеюсь сейчас все сохранится как положено.
    .catch(() => res.status(errors.ERROR_DEFAULT).send({
      message: 'Internal server Error',
    }));
};

const createCard = (req, res) => {
  const { _id } = req.user; // ID пользоваля, задан в app.js
  const { name, link } = req.body;

  cardModel.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else {
        res.status(errors.ERROR_DEFAULT).send({
          message: 'Internal server Error',
        });
      }
    });
};

// Вариант 3. Работает. Ниже сохранил вариант (2) без async/await и try/catch
// !!!
// Большое спасибо за советы! Так действительно проще и чуть красивее
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params; // ID удаляемой карточки, из URL
    const { _id } = req.user; // ID пользоваля, задан в app.js

    // Если карточка с таким ID не найдена - выбрасывается ошибка
    const card = await cardModel.findById(cardId)
      .orFail(() => {
        throw new Error('NotFound');
      });

    const cardOwnerId = card.owner.toString();

    // Проверяем является ли пользователь, который пытается удалить карточку, ее владельцем.
    if (_id === cardOwnerId) {
      // Удаляем карточку; отправляем код состояния и сообщение
      await cardModel.deleteOne(card)
        .then(() => res.status(200).send({
          message: 'Карточка успешно удалена',
        }));
    } else {
      // Выдаем ошибку, если карточку удаляет не тот пользователь, который ее создал
      throw new Error('Forbidden');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(errors.ERROR_BAD_REQUEST).send({
        message: 'Bad Request',
      });
    } else if (err.message === 'Forbidden') {
      res.status(errors.ERROR_ACCESS_DENIDED).send({
        message: 'Access denied',
      });
    } else if (err.message === 'NotFound') {
      res.status(errors.ERROR_NOT_FOUND).send({
        message: 'Card not found',
      });
    } else {
      res.status(errors.ERROR_DEFAULT).send({
        message: 'Internal server Error',
      });
    }
  }
};

const likeCard = (req, res) => {
  const { cardId } = req.params; // ID удаляемой карточки, из URL
  const { _id } = req.user; // ID пользоваля, задан в app.js

  cardModel.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => { // Если карточка с таким ID не найдена - выбрасывается ошибка
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errors.ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else if (err.message === 'NotFound') {
        res.status(errors.ERROR_NOT_FOUND).send({
          message: 'Card not found',
        });
      } else {
        res.status(errors.ERROR_DEFAULT).send({
          message: 'Internal server Error',
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => { // Если карточка с таким ID не найдена - выбрасывается ошибка
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errors.ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else if (err.message === 'NotFound') {
        res.status(errors.ERROR_NOT_FOUND).send({
          message: 'Card not found',
        });
      } else {
        res.status(errors.ERROR_DEFAULT).send({
          message: 'Internal server Error',
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
