const router = require('express').Router();
const userController = require('../controllers/userController');
const {catchErrors} = require('../handlers/errorHandlers');
const {asyncMiddleware} = require('../utils/async');


router.get('/',userController.getUsers); //get All user
router.post('/signup',userController.signup); //get single user
router.post('/login',userController.login);
router.get('/:id',userController.getUserDoc);



module.exports = router;