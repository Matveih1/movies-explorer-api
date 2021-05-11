const router = require('express').Router();
const {
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

const {
  validationMovie,
} = require('../middlewares/validation');

router.post('/', validationMovie, createMovies);
router.delete('/:movieId', deleteMovies);

module.exports = router;
