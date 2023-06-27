const userModel = require('../models/user');
// const ValidationError = require('../errors/validation-error');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

// Роут, путь, маршрут, эндпоинт для получения пользователей
const getUsers = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('getUsers req.user:', req.user);

  userModel.find({})
    .then((users) => res
      .status(200).send(users))
    .catch((err) => res
      .status(ERROR_DEFAULT).send({
        message: 'Internal server Error',
        err: err.message,
        stack: err.stack,
      }));
};

const getUserById = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('getUserById req.body:', req.body);

  // const { userId } = req.params; // В req.params всегда приходят строчные данные (строка)!
  // const user = users.find((item) => item._id === Number(userId));

  userModel.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res
      .status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
          err: err.message,
          stack: err.stack,
        });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'User not found',
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

const createUser = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('createUser req.body:', req.body);

  userModel.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log('err.name:', err.name);
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

const updateUser = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('updateUser req.body:', req.body);

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
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
          err: err.message,
          stack: err.stack,
        });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'User not found',
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

const updateUserAvatar = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('updateUserAvatar req.body:', req.body);

  const { _id } = req.user; // ID пользоваля, задан в app.js
  const { avatar } = req.body;

  userModel.findByIdAndUpdate(
    _id,
    { avatar }, // { avatar: req.body.avatar } // { ...req.body } ???
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
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Bad Request',
          err: err.message,
          stack: err.stack,
        });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'User not found',
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
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
