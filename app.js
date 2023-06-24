const express = require('express');
// const bodyParser = require('body-parser'); // Теперь НЕ надо. Он включен в состав express.
const mongoose = require('mongoose');

const router = require('./routes'); // Файл index берется по-умолчанию, указывать не надо
// const allRoutes = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // Это старые параметры, которые давно не поддерживаются
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(express.json()); // для собирания JSON-формата. Вместо body-parser
// app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(router);

app.listen(PORT, () => {
  // Если все работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT} / Приложение прослушивает порт ${PORT}`);
});
