const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const regex = /^(https?:\/\/)(www\.)?[^\s]*$/;
// ^(https?:\/\/)?(www\.)?[\w\d\.\-\_\~\:\/\?#\[\]@!\$&'\(\)\*\+,;=]+#?$

const userControllers = require('../controllers/users');

// Роут (путь, маршрут, эндпоинт) для получения пользователей
router.get('/', userControllers.getUsers);

// Роут для получения информации о текущем пользователе
router.get('/me', userControllers.getCurrentUser);

// ______________________________________________
// Роут для получения пользователя по ID в URL
router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), userControllers.getUserById);

// ______________________________________________
// Роут обновления данных пользователя - имя и описание
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), userControllers.updateUserInfo);

// ______________________________________________
// Роут обновления данных пользователя - аватар
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(regex).required(),
  }),
}), userControllers.updateUserAvatar);

module.exports = router;

// ------------------------------------------------------------
// // Роут (путь, маршрут, эндпоинт) для получения пользователей
// router.get('/', userControllers.getUsers);

// // Роут для получения информации о текущем пользователе
// router.get('/me', userControllers.getCurrentUser);

// // Роут для получения пользователя по ID в URL
// router.get('/:userId', userControllers.getUserById);

// // Роут обновления данных пользователя - имя и описание
// router.patch('/me', userControllers.updateUserInfo);

// // Роут обновления данных пользователя - аватар
// router.patch('/me/avatar', userControllers.updateUserAvatar);
