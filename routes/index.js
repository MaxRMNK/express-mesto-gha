const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const regex = /^(https?:\/\/)(www\.)?[^\s]*$/;
// ^(https?:\/\/)?(www\.)?[\w\d\.\-\_\~\:\/\?#\[\]@!\$&'\(\)\*\+,;=]+#?$

const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

const NotFoundError = require('../errors/not-found-err'); // 404 Not Found

// Создал эти роуты здесь, а не в app.js (как сказано в ТЗ)
// чтобы не выносить туда еще и код обработки 404 страницы
// router.post('/signup', createUser); // Роут регистрации
// router.post('/signin', login); // Роут входа

router.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser); // Роут регистрации

router.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login); // Роут входа

router.use('/users', auth, userRoutes); // Защищено авторизацией
router.use('/cards', auth, cardRoutes); // Защищено авторизацией

router.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

/**
 * Если вызываем Роутер без пути, тогда в вызываемом файле пути указываются полностью.
 * Если вызываем Роутер с указанием пути, тогда пути здесь и вызываемом файле суммируются:
 * Видео "Как развернуть сервер" 0:58:30+
 */
// router.use('/users', userRoutes);
// router.use(userRoutes);

// Так все роуты идущие после будут доступны только авторизованным пользователям
// router.use(auth);

// router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена 111')));

module.exports = router;
