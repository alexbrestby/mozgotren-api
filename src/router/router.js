const Router = require('express');
const { check } = require('express-validator');
const UserController = require('../controllers/UserController.js');

const router = new Router();

// authentication routes
router.post('/check-registration', UserController.checkRegistration);
router.post('/login', UserController.login);
router.post('/registration', [
  check('username', 'Имя пользователя не должно быть пустым').notEmpty(),
  check('password', 'Пароль не может быть менее 6 символов').isLength({ min: 6, max: 20 }),
], UserController.registration);

// user data routes
router.post('/get-user', UserController.getUserData);

module.exports = router;