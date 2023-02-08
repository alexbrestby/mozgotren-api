const Router = require('express');
const { check } = require('express-validator');
const UserController = require('../controllers/UserController.js');

const router = new Router();

// router.get('/users', UserController.getAll);
// router.get('/users/:id', UserController.getOne);
router.post('/check-registration', UserController.checkRegistration);
router.post('/registration', [
  check('username', 'Имя пользователя не должно быть пустым').notEmpty(),
  check('password', 'Пароль не может быть менее 6 символов').isLength({ min: 6, max: 20 }),
], UserController.registration);
router.post('/login', UserController.login);

module.exports = router;