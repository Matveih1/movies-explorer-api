const router = require('express').Router();
const {
  getUser,
  patchUser,
} = require('../controllers/users.js');

const {
  idUserValidation,
  validationPatchDataUser,
} = require('../middlewares/validation');

router.get('/me', idUserValidation, getUser);
router.patch('/me', validationPatchDataUser, patchUser);

module.exports = router;
