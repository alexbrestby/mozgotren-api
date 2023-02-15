const Router = require('express');
const path = require('path')
const { check } = require('express-validator');
const UserController = require('../controllers/UserController.js');
const multer = require("multer");

const router = new Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.originalname.replace(ext, '') + '-' + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// authentication routes
router.post('/check-registration', UserController.checkRegistration);
router.post('/login', UserController.login);
router.post('/registration', [
  check('username', 'Имя пользователя не должно быть пустым').notEmpty(),
  check('password', 'Пароль не может быть менее 6 символов').isLength({ min: 6, max: 20 }),
], UserController.registration);

// user data routes
router.post('/update-password', UserController.updatePassword);
router.post('/get-user', UserController.getUserData);
router.post('/upload-userdata', upload.single('image'), UserController.uploadUserData);

module.exports = router;