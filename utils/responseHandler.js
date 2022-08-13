/**
 * Response Handler
 * @param {object} req 
 * @param {object} res 
 * @param {string|object} data 
 * @param {string} statusCode 
 */
const responseHandler = (req, res, data, statusCode) => {
  statusCode ? res.status(statusCode).send(data) : res.send(data);
};

module.exports = responseHandler;