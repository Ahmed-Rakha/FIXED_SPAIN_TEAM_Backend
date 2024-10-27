const express = require('express');
const router = express.Router();
const casesGrandesController = require('../controllers/admin/caseGrande.admin.controller');
const userController = require('../controllers/user/user.controller');
const authController = require('../controllers/auth/user.auth.controller');
const { protectRoute, checkForAdminRole } = require('../middlewares/auth.mw');

router
  .route('/cases') 
  .get(protectRoute, casesGrandesController.getCasesHandledByUsers)// this route get all cases handled by users and this route is requested by just admin
  .post( protectRoute, checkForAdminRole , casesGrandesController.createCase);
  // .post( casesGrandesController.createCase);

  // router
  // .route('/test').get(casesGrandesController.test);
router
  .route('/cases/:id')
  .get(casesGrandesController.getCase)
  .patch(casesGrandesController.updateCase)
  .delete(casesGrandesController.deleteCase);

// User routes
router
  .route('/users')
  .get(userController.getAllUsers)
  .post(authController.registerUser);
router
  .route('/users/:id')
  .get(protectRoute, authController.getUserProfile)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
