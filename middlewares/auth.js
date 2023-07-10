const { checkToken } = require('../utils/jwt-auth');
const UnauthorizedError = require('../errors/unauthorized-err'); // 401 Unauthorized

// Вариант с хранением токена в localStorage, искать в сохраненках Спринта - ПР14, "версия 2".
module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try { // верифицируем токен
    payload = checkToken(token);
  } catch (err) { // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация / auth.js');
  }

  req.user = payload;

  next(); // пропускаем запрос дальше
};

// module.exports = auth;
