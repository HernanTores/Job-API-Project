//const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong please try again later'
  }

  /* if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  } */

  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND
    customError.msg = `Not found job with id: ${err.value}`
  }

  if (err.name === 'ValidationError') {
    const error = Object.values(err.errors)
    customError.msg = error.map((item) => item.message).join(', ')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)}`
  }
  //return res.status(500).json({err})
  return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandlerMiddleware
