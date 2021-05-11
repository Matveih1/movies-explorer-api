const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const AuthError = require('../errors/auth-err');
const BadRequestErr = require('../errors/bad-request-err');
const { JWT_SECRET } = require('../config');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  // проверим пользователя
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с такой почтой уже есть');
      }

      return bcryptjs.hash(password, 10);
    })
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Невалидные данные'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestErr('Невалидные данные'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(new AuthError('Неправильные почта или пароль'))
    .then((user) => bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }

          return user;
        })
    )
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }, // время жизни токена
      );
      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((data) => res.status(200).send(data))
    .catch(next);
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  patchUser,
};
