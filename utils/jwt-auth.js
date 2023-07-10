// Почему так лучше: подключение пакета JWT, секретный ключ, настройка его срока жизни,
// генерация и проверка токена находятся в одном месте.
// см. вебинар: Наталья Дружинина, cohort_61, 2023-06-02.
const jwt = require('jsonwebtoken');

const SECRET_KEY = '9Y5Qnt9sgmY0tuX3d2jQTz2LqewAIjD0uyfKSLZ5II0p01g4fVYwazgjuZRgzqsA'; // 64
const EXPIRES_IN = '7d'; // Срок жизни токена

const signToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
// // return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

const checkToken = (token) => jwt.verify(token, SECRET_KEY);
// // return jwt.verify(token, SECRET_KEY);

// Вариант с хранением токена в localStorage, искать в сохраненках Спринта - ПР14, "версия 2".
// // Берет SECRET_KEY_ENV из переменной окружения
// const signToken = (payload) => jwt
//   .sign(payload, process.env['SECRET_KEY_ENV'], { expiresIn: EXPIRES_IN });
// const checkToken = (token) => jwt.
//   verify(token, process.env['SECRET_KEY_ENV']);

module.exports = {
  signToken,
  checkToken,
};
