const responseHandler = (req, res, data, statusCode) => {
  if (statusCode) res.status(statusCode).send(data);
  res.send(data);
};

module.exports = responseHandler;