const { check, body, validationResult } = require('express-validator');

const firstName = check('firstName').notEmpty().withMessage('First name is required');
const lastName = check('lastName').notEmpty().withMessage('Last name is required');
const info = check('info').optional();
const institutionName = check('institutionName').notEmpty().withMessage('Institution name is required');
const courseName = check('courseName').notEmpty().withMessage('Course name is required');
const expGradYear = check('expGradYear').isInt({ min: 2022 }).withMessage('Expected graduation year must be at least 2022');
/*const skills = check('skills')
.isArray().withMessage('Skills must be an array')
.custom(value => {
  if (!Array.isArray(value)) {
    throw new Error('Skills must be an array');
  }

  // Check that each skill is a string
  if (value.some(skill => typeof skill !== 'string')) {
    throw new Error('Each skill must be a string');
  }

  return true;
})
*/
/*module.exports = {
  profileValidation : [firstName, lastName, info, institutionName, courseName, expGradYear]
}*/

const profileValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('First name is required'),
  body('info').optional(),
  body('institutionName').notEmpty().withMessage('Institution name is required'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('expGradYear').isInt({ min: 2022 }).withMessage('Expected graduation year must be at least 2022'),
  body('skills')
  .isArray().withMessage('Skills must be an array')
  .custom(value => {
  if (!Array.isArray(value)) {
    throw new Error('Skills must be an array');
  }

  // Check that each skill is a string
  if (value.some(skill => typeof skill !== 'string')) {
    throw new Error('Each skill must be a string');
  }

  return true;
  }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      // Validation passed, proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
];

module.exports=profileValidation;