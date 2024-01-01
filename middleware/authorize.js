const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorize (req, res, next) {
    const acessToken = req.header("jwt_token");
    //const refreshToken = req.cookies['refreshToken'];

    //if(!acessToken && !refreshToken){
    //  res.status(401).send('Access denied . No token provided');
    //}
    if(!acessToken){
        return res.status(403).json({msg:"authorization denied"});
    }

    try{
        const verify = jwt.verify(acessToken, process.env.jwtSecret);
        req.user = verify.user;
        //console.log(req.user);
        next();
    }catch(err){
      console.log(err);
       // res.status(401).json({ msg: "Token is not valid "});
       //if(!refreshToken){
       // return res.status(401).send('Access Denied. No refresh token provided.');
       //}
       /*try{
          const decoded = jwt.verify(refreshToken, process.env.REF_SECRET);
          const accessToken = jwt.sign({ user: decoded.user }, process.env.jwtSecret, { expiresIn: '1h' });
          res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
          .header('Authorization', accessToken)
          .send(decoded.user);
       }catch(err){
          return res.status(400).send('Invalid Token.');
       }*/
    }
};

const githubAuthorize = (req, res, next) =>{
  if(req.isAuthenticated()){
    if(req.user && req.user.github_Id){
      return next();
    }else{
      return res.status(401).json({ message: 'Unauthorized: Please log in with GitHub' }); 
    }
  }else{
    return res.status(401).json({ message: 'not authenticated' }); 
  }
}

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

module.exports = {authorize, roleAccessMiddleware, githubAuthorize};

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