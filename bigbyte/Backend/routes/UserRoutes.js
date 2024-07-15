const express = require('express');
const router = express.Router();


const AuthenticationController = require('../controllers/Authentication');
const UserController = require('../controllers/Users');
const ResumeController = require('../controllers/Resume');


// AUTHENTICATION ROUTES
router.route('/UserDetails').post(AuthenticationController.verifyToken, AuthenticationController.CreateDetailsAboutUser);



// DATABASE ROUTES
//router.route('/AddUser').post(UserController.addUser);
router.route('/QueryUsers').get(UserController.queryUsers);
router.route('/DeleteUser').delete(UserController.deleteUser);
router.route('/GetUser').get(AuthenticationController.verifyToken, UserController.getUser, ResumeController.getResume);
router.route('/GetUserProfile').get(AuthenticationController.verifyToken, AuthenticationController.IsStudent, UserController.getUserProfile, ResumeController.getResume);
router.route('/GetUserType').get(AuthenticationController.verifyToken, AuthenticationController.DetermineuserType);
router.route('/ApplyToInternship').post(UserController.applyForInternship);
router.route('/ReferalStatus').get(AuthenticationController.verifyToken, AuthenticationController.IsStudent, UserController.CheckReferalStatus);
router.route('/UpdateUser').patch(AuthenticationController.verifyToken, UserController.updateUser);


module.exports = router;
