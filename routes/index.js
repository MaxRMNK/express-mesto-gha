const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');

const ERROR_NOT_FOUND = 404;

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({
    message: 'Page not found',
  });
});

/**
 * Если вызываем Роутер без пути, тогда в вызываемом файле пути указываются полностью.
 * Если вызываем Роутер с указанием пути, тогда пути здесь и вызываемом файле суммируются:
 * Видео "Как развернуть сервер" 0:58:30+
 */
// router.use('/users', userRoutes);
// router.use(userRoutes);

module.exports = router;
