const { check, body, validationResult } = require('express-validator');

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const profileValidation = [
  body('about').optional(),
  body('institutionName').optional().isLength({ min: 2 }).withMessage('Institution name must have at least 2 characters'),
  body('graduationYear').isInt({ min: getCurrentYear() }).withMessage(`Graduation year must be at least ${getCurrentYear()}`),
  body('courseName').optional().isLength({ min: 2 }).withMessage('Course name must have at least 2 characters'),
  body('siteLink').optional().isURL().withMessage('Invalid URL format'),
  body('location').optional(),
  body('contactMail').optional().isEmail().withMessage('Invalid email address'),
  body('linkedinProfileLink').optional(),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      next(); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
];

const AccountValidation = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one digit'),
  
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      next(); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
];

const CompanyPageValidation = [
  body('name').notEmpty().withMessage('Name of the company should be provided'),
  body('bio')
    .notEmpty().withMessage('Bio of the company should be provided')
    .isLength({ min: 10, max: 160 }).withMessage('Bio must be between 10 and 160 characters'),
  body('location').notEmpty().withMessage('Location of the company should be provided'),
  body('link')
    .notEmpty().withMessage('Link of the company should be provided')
    .isURL().withMessage('Link must be a valid URL'),
  

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
]

const InternshipValidation = [
  body('title').notEmpty().withMessage('Title of the company should be provided'),
  body('description').notEmpty().withMessage('Description of the company should be provided'),
  body('last_date').notEmpty().withMessage('Last date to apply should be provided'),
  body('unpaid').notEmpty().withMessage('Specify if the internship is unpaid'),
  body('min_salary')
    .custom((value, { req }) => {
      if (req.body.unpaid === true) {
        // If internship is unpaid, min_salary should be 0 or undefined
        if (value !== undefined && value !== 0) {
          throw new Error('Minimum salary should be 0 for unpaid internship');
        }
      }
      return true;
    }),
  body('max_salary')
    .custom((value, { req }) => {
      if (req.body.unpaid === true) {
        // If internship is unpaid, max_salary should be 0 or undefined
        if (value !== undefined && value !== 0) {
          throw new Error('Maximum salary should be 0 for unpaid internship');
        }
      }
      return true;
    })
];

module.exports= { profileValidation , CompanyPageValidation, InternshipValidation , AccountValidation};