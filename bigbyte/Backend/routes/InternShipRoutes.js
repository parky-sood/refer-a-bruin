const express = require('express');
const router = express.Router();

const AuthenticationController = require('../controllers/Authentication');
const InternshipController = require('../controllers/Internships');
const UserController = require('../controllers/Users');

// Internship routes
router.route('/AddInternship').post(AuthenticationController.verifyToken, AuthenticationController.IsMentor, InternshipController.addInternship);
router.route('/GetAllInternships').get(AuthenticationController.verifyToken, InternshipController.getAllInternships);

router.route('/GetMentorsInternships').get(AuthenticationController.verifyToken, InternshipController.getAllInternshipsRelatedToAMentor);

router.route('/QueryInternships').get(AuthenticationController.verifyToken, InternshipController.queryInternships);
router.route('/DeleteInternship').delete(AuthenticationController.verifyToken, InternshipController.deleteInternship);
router.route('/GetInternship').get(AuthenticationController.verifyToken, InternshipController.getInternship);
router.route('/RequestReferal').get(AuthenticationController.verifyToken, AuthenticationController.IsStudent, UserController.getUserAndResume, InternshipController.requestReferal);

module.exports = router;
