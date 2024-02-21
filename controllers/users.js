const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt

/**
 * Модель строится на основе Схемы и является «оберткой» из методов вокруг схемы.
 * Благодаря ей мы можем читать, добавлять, удалять и обновлять документы в БД.
 * Здесь, при импорте Модели ей можно дать любое название (в схеме - 'user').
 */
const UserModel = require('../models/user');

const { signToken } = require('../utils/jwt-auth');

const ValidationError = require('../errors/validation-err'); // 400 Bad Request
const UnauthorizedError = require('../errors/unauthorized-err'); // 401 Unauthorized
// const ForbiddenError = require('../errors/forbidden-err'); // 403 Forbidden
const NotFoundError = require('../errors/not-found-err'); // 404 Not Found
const ConflictError = require('../errors/conflict-err'); // 409 Conflict
// const UnhandledError = require('../errors/unhandled-err'); // 500 Internal Server Error

const SALT_ROUNDS = 10; // Надежная "соль" от 12 и больше.
const ERROR_DUPLICATE_KEY = 11000;

// Роут, путь, маршрут, эндпоинт для получения всех пользователей
const getUsers = (req, res, next) => {
  UserModel.find({})
    .orFail(() => {
      throw new ValidationError('Некорректный запрос');
    })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

// Роут для получения информации о текущем пользователе
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user; // ID пользователя, из токена

  UserModel.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    // Проверка на 'CastError', как в getUserById, не нужна: В токене ID всегда корректный
    .catch(next);
};

// Роут для получения пользователя по ID
const getUserById = (req, res, next) => {
  const { userId } = req.params; // ID пользователя, из URL
  // console.log('req.params:', req.params);

  UserModel.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        // Если userId не может быть преобразован в ObjectId
        // err.name === 'CastError'
        // next(new ValidationError('Переданы некорректные данные'));
        next(new ValidationError('Некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
};

// Роут создания пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // Чтобы отсеч пустые запросы еще до обращения к БД.
  if (!email || !password) {
    throw new ValidationError('Ошибка валидации, переданы некорректные данные');
  }

  bcrypt.hash(String(password), SALT_ROUNDS) // Хеширование пароля
    // String() - на всякий случай, если пользователь введет пароль-число.
    .then((hashedPassword) => {
      UserModel.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then(() => {
          res.status(201).send({ // HTTP_STATUS.CREATED
            name, about, avatar, email,
          });
        })
        .catch((err) => {
          if (err.code === ERROR_DUPLICATE_KEY) { // 11000
            next(new ConflictError('Такой пользователь уже существует'));
          } else if (err instanceof mongoose.Error.ValidationError) {
            // Выловим первую ошибку валидатора из Схемы. С остальными разберемся потом.
            const errorFields = Object.keys(err.errors);
            const errorFirstField = err.errors[errorFields[0]];

            if (errorFirstField) {
              // Если ошибка поймана валидатором Схемы - берем текст из нее
              next(new ValidationError(errorFirstField.message));
            } else {
              next(new ValidationError('Ошибка валидации, переданы некорректные данные'));
            }
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

// Роут аутентификацияя пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  // ПР14. Рекомендация В.Малий, чтобы отсеч пустые запросы еще до обращения к БД.
  if (!email || !password) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  UserModel.findOne({ email })
    .select('+password')
    .orFail(new UnauthorizedError('Неправильные почта или пароль')) // Неправильная почта
    .then((user) => Promise.all([user, bcrypt.compare(String(password), user.password)]))
    // // return Promise.all([user, bcrypt.compare(String(password), user.password)]);
    // Делаем такую конструкцию, чтобы избавиться от вложенности .then:
    // Promise.all - передает в следующий then массив с "объектом пользователя" и результатом
    // сравнения полученного пароля с хэшем.
    // String() - на всякий случай, если пользователь введет пароль-число.
    .then(([user, isValidHash]) => {
      if (!isValidHash) {
        // В3.
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      // В.2.: Отправляем токен в куки + ответ пользователю.
      // Вариант с хранением токена в localStorage, искать в сохраненках Спринта - ПР14, "версия 2".
      const token = signToken({ _id: user._id }); // { _id: user._id } - payload / пейлоуд
      const { name, about, avatar } = user;

      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7, // час * часов * дней = срок жизни 7 суток
        httpOnly: true, // Запретить читать куку из JavaScript
        // sameSite: true, // посылать куки, только если запрос сделан с того же домена, где сервер
        // secure: true, // Куки должны уходить только по https
      }).send({
        name, about, avatar, email,
      });
    })
    .catch(next);
};

// !!! НЕ ЭКСПОРТИРОВАТЬ
// Мидлвара (?) обновления информации о пользователе
const updateUser = (req, res, next, userData) => {
  const { _id } = req.user; // ID пользователя, из токена

  UserModel.findByIdAndUpdate(
    _id,
    userData, // Переданные данные
    { new: true, runValidators: true }, // обработчик then получит на вход обновленную запись
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Ошибка валидации, переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Роут обновления информации о пользователе - имя и описание
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new ValidationError('Не корректный запрос');
  }

  updateUser(req, res, next, { name, about });
};

// Роут обновления информации о пользователе - аватар
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new ValidationError('Не корректный запрос');
  }

  updateUser(req, res, next, { avatar });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateUserInfo,
  updateUserAvatar,
};

// // В.1.: Просто отправляем токен пользователю
// const token = signToken({ _id: user._id }); // { _id: user._id } - payload / пейлоуд
// // До того как вынес метод jwt.sign в отдельный файл jwt-auth.js:
// // const token = jwt.sign({ _id: user._id }, JWT.SECRET_KEY, { expiresIn: JWT.EXPIRES_IN });
// // eslint-disable-next-line no-console
// // console.log('Пользователь найден', token);

// res.status(200).send({ token });
