const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes'); // Файл index берется по-умолчанию, указывать не надо

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// для собирания JSON-формата. Вместо body-parser
app.use(express.json());

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

app.use((req, res) => {
  res.status(404).send({
    message: 'Page not found',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT} / Приложение прослушивает порт ${PORT}`);
});
