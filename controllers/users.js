// const users = [
//   { _id: 1, name: 'Mike' },
//   { _id: 2, name: 'Alex' },
// ];
// let id = 0;

const userModel = require('../models/user');

// Роут, путь, маршрут, Эндпоинт для получения пользователей
const getUsers = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('Это запрос на /users');

  userModel.find({})
    .then((users) => res
      .status(200)
      .send(users))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Internal server Error',
        err: err.message,
        stack: err.stack,
      }));
};

const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .then((user) => res
      .status(200)
      .send(user))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Internal server Error',
        err: err.message,
        stack: err.stack,
      }));

  // const { userId } = req.params; // В req.params всегда приходят строчные данные (строка)!
  // const user = users.find((item) => item._id === Number(userId));

  // if (user) {
  //   res.status(200).send(user);
  //   return;
  // }

  // res.status(404).send({ message: 'User not found' });
};

const createUser = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('req.body', req.body);

  userModel.create(req.body)
    .then((user) => res
      .status(201)
      .send(user))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Internal server Error',
        err: err.message,
        stack: err.stack,
      }));

  // // let id = 0;
  // const lastUser = users[users.length - 1];
  // let { _id } = lastUser;
  // _id += 1;

  // const newUser = {
  //   _id,
  //   // Можно захардкодить, что куда будет добавляться, а можно все сделать через "...rest"
  //   // name: req.name,
  //   ...req.body, // все что есть в теле запроса складываем сюда
  // };

  // users.push(newUser); // Сначала добавляем данные к массиву (в БД), потом все остальное

  // // res.send(users);
  // res.status(201).send(newUser);
  // // "status(201)" - означает, что запрос прошел успешно.
  // // Добавлять не обязательно, но это будет хорошим тоном.
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
