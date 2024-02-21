const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// Для сокращения размера дистрибутива, подключаются только используемые библиотеки:
// const { isEmail, isURL } = require('validator'); // 112.6k
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

// Определение схемы
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина имени 2 символа'],
    maxlength: [30, 'Максимальная длина имени 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    // required: true,
    minlength: [2, 'Минимальная длина описания 2 символа'],
    maxlength: [30, 'Максимальная длина описания 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    // minlength: 8,
    select: false, // При запросе данных пользователя (GET) пароль отправляться не будет
  },
}, { versionKey: false });

// Создание и экспорт модели
module.exports = mongoose.model('user', userSchema);
// 'user' - имя модели = название коллекции ("таблицы") в БД.
// В БД к названию на конце добавляется 's'.

// Так тоже работает. Смотри комменты в контроллере.
// const UserModel = mongoose.model('user', userSchema);
// module.exports = UserModel;

// .
// УДАЛИТЬ ???
// .
// // Определение собственного метода (toJSON) модели.
// // Этот метод возвращает значение текущий объект убирая из него поле password.
// // Добавленные методы будут доступны только на экземплярах модели, а не на всей коллекции,
// // например, этот только внутри вызова модели UserModel (контроллера user.js).
// // eslint-disable-next-line func-names
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

// .
// Не надо. Код из урока. У меня он в Контроллере
// .
// // eslint-disable-next-line func-names
// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email }) // Ищем пользователя по почте
//     // this - это модель user (UserModel)
//     .select('+password')
//     // Добавляет поле password в исключения, т.к. оно отключено в Схеме (см.выше)
//     .then((user) => {
//       // Если пользователь не найден - отклоняем промис
//       if (!user) {
//         return Promise.reject(new Error('Неправильные почта или пароль'));
//       }

//       // Если пользователь найден - сравниваем хеши
//       return bcrypt.compare(String(password), user.password)
//         .then((isValidUser) => {
//           // Если пароль не прошел проверку - отклоняем промис
//           if (!isValidUser) {
//             return Promise.reject(new Error('Неправильные почта или пароль'));
//           }

//           // Если пароль прошел проверку - возвращаем данные пользователя
//           return user;
//         });
//     });
// };
