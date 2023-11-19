const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorize (req, res, next) {
    const token = req.header("jwt_token");
    if(!token){
        return res.status(403).json({msg:"authorization denied"});
    }

    try{
        const verify = jwt.verify(token, process.env.jwtSecret);
        req.user = verify.user;
        console.log(req.user);
        next();
    }catch(err){
        res.status(401).json({ msg: "Token is not valid "});
    }
};

const roleAccessMiddleware = (...roles) => {
    return (req, res, next) => {
      try {
        // Assuming role is stored in req.user.role
        if (roles.find(role => req.user.role === role)) {
          next(); // Allow access
        } else {
          res.status(403).json({ error: 'Access denied. Invalid role.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  };

module.exports = {authorize, roleAccessMiddleware};

/*function authorizeStudent(req, res, next){
    const token = req.header("jwt_token");
    if(!token){
        return res.status(401).json({error :'token is missing'});
    }
    try{
        const decoded = jwt.verify(token, process.env.jwtSecret);
        if(decoded.role === 'student'){
            next();
        }else{
            res.status(403).json({error:'acess denied'});
        }

    }catch(error){
        console.error('Token verification failed:', error.message);
        res.status(401).json({error:'Unauthorized'})
    }
}*/