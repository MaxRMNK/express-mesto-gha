const cardModel = require('../models/card');

const ERROR_BAD_REQUEST = 400;
const ERROR_ACCESS_DENIDED = 403;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const getCards = (req, res) => {
  // // eslint-disable-next-line no-console
  // console.log('Роут getCards, req.user._id:', req.user._id);

  cardModel.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(ERROR_DEFAULT).send({
      message: 'Internal server Error',
      err: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  // // eslint-disable-next-line no-console
  // console.log('req.body', req.body);

  cardModel.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(ERROR_DEFAULT).send({
          message: 'Internal server Error',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

// Вариант 3. Работает. Ниже сохранил вариант (2) без async/await и try/catch
// !!!
// Уважаемый ревьюер, прошу наиболее придирчиво проверить этот контроллер,
// не уверен, что правильно использовал sync/await и try/catch.
// Буду признателен за советы по улучшению этого кода.
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params; // ID удаляемой карточки, из URL
    const { _id } = req.user; // ID пользоваля, задан в app.js

    // Если карточка с таким ID не найдена - выбрасывается ошибка
    const card = await cardModel.findById(cardId);
    if (card === null) {
      throw new Error('NotFound');
    } else {
      const cardOwnerId = card.owner.toString();

      // Проверяем является ли пользователь, который пытается удалить карточку, ее владельцем.
      if (_id === cardOwnerId) {
        // Удаляем карточку; отправляем код состояния и сообщение
        cardModel.deleteOne(card)
          .then(() => res.status(200).send({
            message: 'Карточка успешно удалена',
          }));
      } else {
        // Выдаем ошибку, если карточку удаляет не тот пользователь, который ее создал
        throw new Error('Forbidden');
      }
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_BAD_REQUEST).send({
        message: 'Bad Request',
        err: err.message,
        stack: err.stack,
      });
    } else if (err.message === 'Forbidden') {
      res.status(ERROR_ACCESS_DENIDED).send({
        message: 'Access denied',
      });
    } else if (err.message === 'NotFound') {
      res.status(ERROR_NOT_FOUND).send({
        message: 'Card not found',
      });
    } else {
      res.status(ERROR_DEFAULT).send({
        message: 'Internal server Error',
        err: err.message,
        stack: err.stack,
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
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
          err: err.message,
          stack: err.stack,
        });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Card not found',
        });
      } else {
        res.status(ERROR_DEFAULT).send({
          message: 'Internal server Error',
          err: err.message,
          stack: err.stack,
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
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
          err: err.message,
          stack: err.stack,
        });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Card not found',
        });
      } else {
        res.status(ERROR_DEFAULT).send({
          message: 'Internal server Error',
          err: err.message,
          stack: err.stack,
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

// // Вариант 2. Работает.
// const deleteCard = (req, res) => {
//   const { cardId } = req.params; // ID удаляемой карточки, из URL
//   const { _id } = req.user; // ID пользоваля, задан в app.js

//   cardModel.findById(cardId)
//     .orFail(() => { // Если карточка с таким ID не найдена - выбрасывается ошибка
//       throw new Error('NotFound');
//     })
//     // .populate('owner') // Добавит в объект карточки все данные пользователя создавшего ее
//     .then((card) => {
//       const cardOwnerId = card.owner.toString(); // ID владельца карточки

//       if (_id === cardOwnerId) {
//         // // eslint-disable-next-line no-console
//         // console.log(`Карточка ${cardId} удалена`);

//         cardModel.deleteOne(card)
//           .then(() => res.status(200).send({
//             message: 'Карточка успешно удалена',
//           }));
//       } else {
//         // Выдаем ошибку, если карточку удаляет не тот пользователь, который ее создал
//         throw new Error('Forbidden');
//       }
//     })
//     .catch((err) => {
//       if (err.message === 'Forbidden') {
//         res.status(403).send({
//           message: 'Access denied',
//         });
//       } else if (err.message === 'NotFound') {
//         res.status(404).send({
//           message: 'Card not found',
//         });
//       } else {
//         res.status(500).send({
//           message: 'Internal server Error',
//           err: err.message,
//           stack: err.stack,
//         });
//       }
//     });
// };

// // Вариант 1. Не работает проверка владельца карточки
// const deleteCard = (req, res) => {
//   cardModel.findByIdAndRemove(req.params.cardId) // Сразу удаляет найденную карточку, не выполняя
//     .orFail(() => {
//       throw new Error('NotFound');
//     })
//     // .populate('owner') // Добавит в объект карточки все данные пользователя создавшего ее
//     .then((card) => {
//       res.status(200).send(card);
//       // const cardOwnerId = card.owner.toString(); // ID владельца карточки

//       // if (req.user._id === cardOwnerId) {
//       //   // eslint-disable-next-line no-console
//       //   console.log(`Карточка ${cardOwnerId} удалена`);

//       //   res.status(200).send(card);
//       // } else {
//       //   // Выдаем ошибку, если карточку удаляет не тот пользователь, который ее создал
//       //   throw new Error('Forbidden');
//       // }
//     })
//     .catch((err) => {
//       if (err.message === 'NotFound') {
//         res.status(404).send({
//           message: 'Card not found',
//         });
//       } else if (err.message === 'Forbidden') {
//         res.status(403).send({
//           message: 'Access denied',
//         });
//       } else {
//         res.status(500).send({
//           message: 'Internal server Error',
//           err: err.message,
//           stack: err.stack,
//         });
//       }
//     });
// };
