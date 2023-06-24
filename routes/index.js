const router = require('express').Router();

const userRoutes = require('./users');
// const cardRoutes = require('./cards');

router.use('/users', userRoutes);
// router.use(cardRoutes);

/**
 * Если вызываем Роутер без пути, тогда в вызываемом файле пути указываются полностью.
 * Если вызываем Роутер с указанием пути, тогда пути здесь и вызываемом файле суммируются:
 * Видео "Как развернуть сервер" 0:58:30+
 */
// router.use('/users', userRoutes);
// router.use(userRoutes);

module.exports = router;
