const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

const {
  createUser,
  loginUser,
} = require('../controllers/users');

const {
  validationDataUser,
  validationLoginUser,
} = require('../middlewares/validation');

router.post('/signup', validationDataUser, createUser);
router.post('/signin', validationLoginUser, loginUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.all('*', (() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
}));

module.exports = router;
