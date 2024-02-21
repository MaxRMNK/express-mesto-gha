/* eslint-disable no-console */
// require('dotenv').config(); // Для получения SECRET_KEY из переменной окружения.

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

// Логгеры
// const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes'); // Файл index берется по-умолчанию, указывать не надо
const { errorHandler } = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

// Подключение к серверу mongo + Обработка ошибок подключения.
// Спасибо за информацию, но нам вроде запретили пока создавать .env, т.к. он не пушится на гитхаб
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  .then(() => { console.log('Успешное подключение к базе данных'); }) // Удалить при деплое?
  .catch(() => { console.log('Ошибка подключения к базе данных'); });

// Заголовок Content-Security-Policy (CSP)
// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "script-src 'self'; style-src 'self'");
//   next();
// });

// Сборка пакетов в JSON-формате. Вместо bodyParser теперь express:
app.use(express.json());
// Чтобы данные в полученном объекте body могли быть любых типов, а не только строки и массивы:
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Для получения токена из куков

// Логгер запросов. Нужно подключить до всех обработчиков роутов
// app.use(requestLogger);

app.use(router);

// Логгер ошибок. Нужно подключить после обработчиков роутов и до обработчиков ошибок
// app.use(errorLogger);

app.use(errors()); // Обработчик ошибок celebrate
app.use(errorHandler); // Централизованный обработчик ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`); // Приложение прослушивает порт ${PORT}
});

// -----------------------------
// Проверка получения SECRET_KEY из переменной окружения.
// app.use((req, res, next) => {
//   console.log(process.env['SECRET_KEY_ENV']);
//   next();
// });

// -----------------------------
// app.use((req, res, next) => {
//   // console.log('req.headers', req.headers);
//   req.user = {
//     _id: '64963b18735097caf8109597', // _id пользователя
//   };
//   next();
// });

// -----------------------------
// // Подключение к серверу mongo + Обработка ошибок подключения.
// // Если обработка ошибок не нужна, можно удалить then/catch.
// // Если все данные берутся из БД, правильнее все app.use и app.listen перенести в then (?).
// mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
//   // .then(() => { console.log('Успешное подключение к базе данных'); })
//   // .catch((err) => { console.log('Ошибка подключения к базе данных', err); });
//   .catch(() => { console.log('Ошибка подключения к базе данных'); });

// -----------------------------
// Когда у запроса принимается 2 параметра (req, res) - это контроллер или обработчик маршрута.
// Если у обработчика принимается 3 параметра (req, res, next) - это милдвера (middleware).
// Middleware - промежуточное ПО. Его задача что-то сделать и вызвать next (отдать дальше)
// .
// Error hendler, Error Middleware - используются все 4 параметра (req, res, next, error).
// app.use((req, res, next, error) => {
//   console.log(req.path);
//   next();
// });
