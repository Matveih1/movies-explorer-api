const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const BadRequestErr = require('../errors/bad-request-err');

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
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

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((data) => res.send(data))
    .catch(next);
};

const deleteMovies = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((data) => {
      if (req.user._id !== String(data.owner)) {
        throw new ForbiddenError('Запрещено удалять фильмы других пользователей');
      } else {
        return Movie.findByIdAndRemove(movieId)
          .orFail(new NotFoundError('Фильм не найден'))
          .then((movies) => res.status(200).send(movies));
      }
    })
    .catch(next);
};

module.exports = {
  createMovies,
  getMovies,
  deleteMovies,
};
