const { celebrate, Joi, CelebrateError } = require('celebrate');
const isURL = require('validator/lib/isURL');

const urlValidation = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validationDataUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(5),
  }),
});

const validationLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
});

const idUserValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validationPatchDataUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validationMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(1),
    duration: Joi.number().required().min(1),
    year: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
    image: Joi.string().custom(urlValidation).required(),
    trailer: Joi.string().custom(urlValidation).required(),
    nameRU: Joi.string().required().min(1),
    nameEN: Joi.string().required().min(1),
    thumbnail: Joi.string().custom(urlValidation).required(),
    movieId: Joi.number().required().min(1),
  }),
});

module.exports = {
  validationDataUser,
  idUserValidation,
  validationLoginUser,
  validationPatchDataUser,
  validationMovie,
};
