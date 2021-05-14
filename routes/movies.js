const router = require('express').Router();
const {
  createMovies,
  getMovies,
  deleteMovies,
} = require('../controllers/movies');

const {
  validationMovie,
} = require('../middlewares/validation');

router.post('/', validationMovie, createMovies);
router.get('/', getMovies);
router.delete('/:movieId', deleteMovies);

module.exports = router;
