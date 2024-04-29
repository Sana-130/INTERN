const rateLimit = require('rate-limiter-flexible');
const passport = require('passport');
const {jwtGenerator} = require("../utils/TokenGenerator");
const sendConfirmationEmail = require('../utils/emailService');

const emailOpts= {
  points:2,
  duration: 3600
};
const emailRateLimiter = new rateLimit.RateLimiterMemory(emailOpts);

const maxWrongIPperDay = 7;//5
const maxFailsByEmailAndIP = 5;//3

// in-memory rate limiting
const limiterSlowBruteByIP = new rateLimit.RateLimiterMemory({
  points: maxWrongIPperDay,
  duration: 60 * 60 * 24, // 1 day
  blockDuration: 60 * 60 * 24, 
});

const limiterEmailAndIP = new rateLimit.RateLimiterMemory({
  points: maxFailsByEmailAndIP,
  duration: 60 * 60, // 1 hour
  blockDuration: 60 * 60, 
});

const getEmailIPkey = (email, ip) => `${email}_${ip}`;


exports.loginRouteRateLimit = async (req, res, next) => {
  const ipAddr = req.ip;
  const emailIPkey = getEmailIPkey(req.body.email, ipAddr);

//email and ip
  const [resEmailAndIP, resSlowByIP] = await Promise.all([
    limiterEmailAndIP.get(emailIPkey),
    limiterSlowBruteByIP.get(ipAddr)
  ]);

  let retrySecs = 0;
  // Check if IP or email + IP is already blocked
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongIPperDay
  ){
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (
    resEmailAndIP !== null &&
    resEmailAndIP.consumedPoints > maxFailsByEmailAndIP
  ){
    retrySecs = Math.round(resEmailAndIP.msBeforeNext / 1000) || 1;
  }
  if (retrySecs > 0) {
    // sets the response’s HTTP header field
    res.set('Retry-After', String(retrySecs));
    res
      .status(429)
      .json({message : `Too many requests. Retry after ${retrySecs} seconds.`});
  } else {

    passport.authenticate('local', {session : false}, async (err, user, info) =>{    
        if(err){
          return next(err);
        }
            if(!user){
                try{
                    const promises = [limiterSlowBruteByIP.consume(ipAddr)]; 
                    if(info && info.passErr){
                      promises.push(
                        limiterEmailAndIP.consume(emailIPkey)
                      );
                    }                    
                    await Promise.all(promises);
                }catch (rlRejected) {
                    if (rlRejected instanceof Error) {
                      throw rlRejected;
                    } else {
                      const timeOut =
                        String(Math.round(rlRejected.msBeforeNext / 1000)) || 1;
                      res.set('Retry-After', timeOut);
                      return res
                        .status(429)
                        .json({message:`Too many login attempts. Retry after ${timeOut} seconds`});
                    }
                }
            
            
            return res.status(400).json({
                message: info ? info.message: 'Login Failed',
                user : user
            })
          }
        
        if(info && info.status!==true){
            try {
              await emailRateLimiter.consume(info.id);
            } catch (rlRejected) {
              return res.status(429).json({ message: 'Too Many Requests' });
            }
          
          // Apply rate limiting
            // Send confirmation email
            try {
              await sendConfirmationEmail(info.id, info.email);
              return res.status(400).json({
                message: 'User not confirmed. Confirmation email sent.'
              });
            } catch (emailError) {
              console.log(emailError);
              return res.status(500).json({
                message: 'Error sending confirmation email',
                error: emailError,
              });
            }
        }
        if(user){

            if (resEmailAndIP !== null && resEmailAndIP.consumedPoints > 0) {
                await limiterEmailAndIP.delete(emailIPkey);
              }
            
        
        req.login(user, {session: false}, (err) =>{
            if(err){
                res.send(err);
            }
            
            try {
                const jwtToken = jwtGenerator(req.user.user_id, req.user.role, false);
                const jwtExpirationTime = 60 * 60 * 1000;
                const cookieExpiration = new Date(Date.now() + jwtExpirationTime);
                //also generate a refreshtoken and give it to user
                res.cookie('jwt', jwtToken, { httpOnly: true, secure: false, sameSite: 'None' });

                res.json({ token : jwtToken , 
                  user : {id: req.user.user_id, 
                    first_name: req.user.first_name ,
                    last_name:req.user.last_name, 
                    role:req.user.role,
                    githubId:req.user.githubId}
                  });
              } catch (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal Server Error' });
              }
        });
      }
    //loginRouteRateLimit(req, res, next);
})(req, res, next);
    
  }
};