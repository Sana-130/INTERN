const { body, validationResult } = require('express-validator')

function loginValidate (req, res, next){
    const {email, name, password} = req.body;

    function validEmail(userEmail){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register") {
        console.log("email length", !email.length);
        if (![email, name, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
          return res.json("Invalid Email");
        }
      } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
          return res.json("Invalid Email");
        }
      }
    
      next();
}

function validationMiddleware (req, res, next) {
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    })
  }

  next()
}

const internshipValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 50 }).withMessage('Title must be between 5 and 50 characters')
    .escape(), // Sanitize the title field
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 200 }).withMessage('Description must be between 10 and 200 characters')
    .escape(), // Sanitize the description field
  body('company_id').notEmpty().withMessage('Company ID is required').escape(),
  body('date').isISO8601().withMessage('Invalid date format').escape(),
  body('is_active').isBoolean().withMessage('is_active must be a boolean').escape(),

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



module.exports = {loginValidate, validationMiddleware, internshipValidation};