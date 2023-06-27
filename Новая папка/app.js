const express = require('express');
const mongoose = require('mongoose');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');

const router = require('./routes'); // Файл index берется по-умолчанию, указывать не надо

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// для собирания JSON-формата. Вместо body-parser
app.use(express.json());

// // Ревьюер: Можно использовать express-rate-limit для ограничения кол-во запросов,
// // для защиты от DoS-атак: https://www.npmjs.com/package/express-rate-limit
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });
// // Apply the rate limiting middleware to all requests
// app.use(limiter);

// // Ревьюер: Используйте helmet для защиты приложения от некоторых широко известных
// // веб-уязвимостей путем соответствующей настройки заголовков HTTP.
// // Подробнее: https://expressjs.com/ru/advanced/best-practice-security.html
// app.use(helmet());

// Когда у запроса принимается 2 параметра (req, res) - это контроллер или обработчик маршрута.
// Если у обработчика принимается 3 параметра (req, res, next) - это милдвера (middleware).
// Middleware - промежуточное ПО. Его задача что-то сделать и вызвать next (отдать дальше)
// .
// Error hendler, Error Middleware - используются все 4 параметра (req, res, next, error).
// app.use((req, res, next, error) => {
//   console.log(req.path);
//   next();
// });

app.use((req, res, next) => {
  req.user = {
    _id: '64963b18735097caf8109597', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT} / Приложение прослушивает порт ${PORT}`);
});
