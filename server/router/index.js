const { Router } = require('express');
const userController = require('../controller/UserController');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 4, max: 30 }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users',authMiddleware,userController.getAllUsers);

module.exports = router;
