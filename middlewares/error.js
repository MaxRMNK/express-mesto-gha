const errorHandler = (err, req, res, next) => {
  // console.log('err app.js:', err);

  const {
    statusCode = 500, // Будет присвоен статус по-умолчанию, если statusCode пустой
    message = 'Внутренняя ошибка сервера', // Будет присвоен если нет текста ошибки
  } = err;

  res.status(statusCode).send({ message });

  next();
  // Если в конце мидлвары, которая обрабатывает ошибку, не вызвать next(), то та мидлвара,
  // которая вызвала ошибку не сможет передать обработку запроса дальше (после обработки ошибки).
};

module.exports = { errorHandler };
