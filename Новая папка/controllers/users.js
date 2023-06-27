const userModel = require('../models/user');
// const ValidationError = require('../errors/validation-error');
const errors = require('../routes');

// const ERROR_BAD_REQUEST = 400;
// const ERROR_NOT_FOUND = 404;
// const ERROR_DEFAULT = 500;

// Роут, путь, маршрут, эндпоинт для получения пользователей
const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => res
      .status(200).send(users))
    .catch(() => res
      .status(errors.ERROR_DEFAULT).send({
        message: 'Internal server Error',
      }));
};

const getUserById = (req, res) => {
  const { userId } = req.params; // ID пользователя, из URL

  userModel.findById(userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res
      .status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errors.ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else if (err.message === 'NotFound') {
        res.status(errors.ERROR_NOT_FOUND).send({
          message: 'User not found',
        });
      } else {
        res.status(errors.ERROR_DEFAULT).send({
          message: 'Internal server Error',
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
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

const updateUser = (req, res) => {
  const { _id } = req.user; // ID пользоваля, задан в app.js
  const { name, about } = req.body;

  userModel.findByIdAndUpdate(
    _id,
    { name, about }, // { name: req.body.name, about: req.body.about } // { ...req.body } ???
    { new: true, runValidators: true }, // обработчик then получит на вход обновленную запись
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else if (err.message === 'NotFound') {
        res.status(errors.ERROR_NOT_FOUND).send({
          message: 'User not found',
        });
      } else {
        res.status(errors.ERROR_DEFAULT).send({
          message: 'Internal server Error',
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user; // ID пользоваля, задан в app.js
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true }, // обработчик .then получит на вход обновленную запись
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
        });
      } else if (err.message === 'NotFound') {
        res.status(errors.ERROR_NOT_FOUND).send({
          message: 'User not found',
        });
      } else {
        res.status(errors.ERROR_DEFAULT).send({
          message: 'Internal server Error',
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
