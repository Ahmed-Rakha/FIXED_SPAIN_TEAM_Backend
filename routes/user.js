const express = require('express');
const router = express.Router();
const userCasesController = require('../controllers/user/caseGrande.user.controller');
const authController = require('../controllers/auth/user.auth.controller');
const casesGrandesController = require('../controllers/admin/caseGrande.admin.controller');

const { protectRoute } = require('../middlewares/auth.mw');
const filterController = require('../controllers/filters/admin.filter');

// router
//   .route('/cases')
//   .get(protectRoute, userCasesController.getAllCases) // this route get all cases handled by users and this route is requested by just admin

// approved route and controller getAllCasesGrandes & createCase
router
  .route('/cases')
  .get(protectRoute, casesGrandesController.getAllCasesGrandes)
  .post(protectRoute, userCasesController.createCase);

// .post(filterController.filterCasesByAdmin, userCasesController.getAllCases);

 
// approved route and controller -- this route get all cases handled by single user and this route is requested by just user
router
  .route('/handled-cases').get( protectRoute, userCasesController.getUserCases);
 // approved route and controller  -- this route is for update case status by user.
 router
 .route('/cases')
 .patch(protectRoute, userCasesController.updateCase);

  // 
router
  .route('/cases/:id')
  .get(userCasesController.getCase)
  // .patch( protectRoute, userCasesController.updateCase)
  .delete(userCasesController.deleteCase);

 
module.exports = router;
