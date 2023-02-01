const Router = require('express');
const UserController = require('../controllers/UserController.js');

const router = new Router();

router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getOne);
router.post('/users/registration', UserController.registration);
router.post('/users/login', UserController.login)

module.exports = router;