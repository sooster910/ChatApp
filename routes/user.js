const router = require('express').Router();
const userController = require('../controllers/userController');
const {catchErrors} = require('../handlers/errorHandlers');




router.get('/',userController.getUsers);
router.post('/signup',userController.signup);
router.post('/login',userController.login);




module.exports = router;