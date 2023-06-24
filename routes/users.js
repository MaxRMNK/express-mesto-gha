const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/users');
// const userControllers = require('../controllers/users');

// Роут, путь, маршрут, Эндпоинт для получения пользователей
router.get('/', getUsers); // Без деструктуризации при импорте: userControllers.getUsers
// Пути суммируются - см. routes/ndex.js
// router.get('/users', getUsers);

// Роут для получения пользователя по ID в URL
router.get('/:userId', getUserById);
// router.get('/users/:id', getUserById);

// Роут добавления пользователя
router.post('/', createUser);
// router.post('/users', createUser);

module.exports = router;
