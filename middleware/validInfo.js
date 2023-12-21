const { validationResult } = require('express-validator')

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

module.exports = {loginValidate, validationMiddleware};