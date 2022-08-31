const express = require('express');
const { orgController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orgValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(orgValidation.create), orgController.create)
  .get(auth(), orgController.userOrgs);

router
  .route('/:orgId')
  .delete(auth(), validate(orgValidation.deleteOrg), orgController.deleteOrg);

module.exports = router;