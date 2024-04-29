const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const pool = require('../database');
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const sendConfirmationEmail = require('../utils/emailService');
require("dotenv").config();
const rateLimit = require('rate-limiter-flexible');
const { getUserTypeByName } = require('../controllers/auth.controller');
const ROLES = require('../utils/roles');
const userModel = require('../models/user.model');

const opts = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.jwtSecret,
};

const LoginOpts = {
  points : 5 , 
  duration : 1800
}


//const LoginLimiter = new rateLimit.RateLimiterMemory(LoginOpts);
/*try {
  await LoginLimiter.consume(req.ip);
} catch (rlRejected) {
  console.log(rlRejected);
  return done(null, false, { message: 'Too Many Login Attempts. Try again after 30 minutes.' });
}*/




//local stratergy for authentication with email and password
passport.use( 
    new LocalStrategy(
      { usernameField: 'email' ,
      passReqToCallback: true,
       },  
      async (req ,email, password, done) => {
      try {

        const user = await pool.query('SELECT * FROM user_info WHERE email = $1', [email]);
        
        //check if email is confired (active or not)- if not ask them to confirm 
        if (user.rows.length === 0) {
         
          return done(null, false, { message: 'Invalid email or password' });
        }
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
  
        if (!isValidPassword) {

          return done(null, false, { message: 'Invalid email or password' , passErr:true});
        }
      
        const userRole = await pool.query("SELECT role FROM userType WHERE id = $1", [user.rows[0].usertype_id]);
        if (!userRole.rows.length) {
        return done(null, false, { message: 'Invalid role' });
        }

      // Add the role information to the user object
        user.rows[0].role = userRole.rows[0].role;

        const active = user.rows[0].active;
        if(active!==true){
          return done(null, user.rows[0], {status : active, id: user.rows[0].user_id, email: email});
        }else{
          return done(null, user.rows[0]);
        }
        
      } catch (error) {
        console.log(error);
        return done(error);
      }
    })
  );
  
//ONLY RETRIEVE ID FOR STORING IN SESSION
//NO NEED OF QUERY AS WE DONT HAVE ANY SENSITIVE INFO TO BE STORED IN DB

passport.use('initial-login', new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
      // Fetch additional user information during initial login
      // This could include fetching first_name and last_name
      // ...

      // Create user object with additional information
      const userId = jwtPayload.user.id;
      const userRole = jwtPayload.user.role;
      const githubId = jwtPayload.user.githubId;
      //fetch first_name and last_name
      if(githubId){
        const accessToken = await userModel.getAccessToken(userId);
        const response = await fetch(`https://api.github.com/user/${githubId}`, {
          headers: {
              'Authorization': `token ${accessToken}`
          }
      });
      if (response.ok) {
        const data = await response.json();
        const [firstName, lastName] = data.name ? data.name.split(' ') : ['', ''];

        // Create user object with additional information
        const user = {
          id: userId,
          role: userRole,
          githubId: githubId,
          first_name: firstName,
          last_name: lastName,
          imageLink: data.avatar_url,
          profileLink: data.html_url,
          username: data.login
        };

        return done(null, user);
      } else {
        return done(null, false, { message: 'Failed to fetch user information from GitHub API' });
      }
      
      }else{
        const name = await userModel.getNames(userId);
        const user = { id: userId, first_name: name[0].first_name, last_name : name[0].last_name , role: userRole, githubId };
        return done(null, user);
      }
      const first_name = "haha"
      const last_name = "kaka"

      const user = { id: userId, role: userRole, githubId, first_name, last_name };
      return done(null, user);
  } catch (err) {
      return done(err, false);
  }
}));

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try{
        //const user = await pool.query('SELECT * FROM user_info where user_id = $1', [jwtPayload.user.id] );
        //if (user.rows.length === 0) {
        //  return done(null, false);
        //}
        // Add role information to the user object
        //user.rows[0].role = jwtPayload.user.role;
        const userId = jwtPayload.user.id;
        const userRole = jwtPayload.user.role;
        const githubId = jwtPayload.user.githubId

       
        const user = { id: userId, role: userRole , githubId:githubId };
      // Create a user object with the extracted information
       
  
        return done(null, user);
      }catch(err){
        return done(err, false);
      }
    })
  )

  /*passport.serializeUser((user, done)=>{
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) =>{
    try{
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        done(null, user.rows[0]);
    }catch(err){
        done(err);
    }
  });*/

passport.use(new GitHubStrategy ({
  clientID: process.env.Git_CLIENT_ID,
  clientSecret: process.env.Git_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/github/callback'
}, async (accessToken, refreshToken, profile , done) => {
  const queryResult = await pool.query('SELECT * FROM user_info WHERE github_userId = $1', [profile.id]);
  if (queryResult.rows.length > 0) {

    const user = queryResult.rows[0];
    const user_id = user.user_id;
    await pool.query('UPDATE user_info SET accessToken = $1 WHERE user_id = $2', [accessToken, user_id]);

    const userForSession = {
      user_id: user_id,
      role:ROLES.Student,
      githubId:profile.id
    };
    done(null, userForSession);
    
    
  }else{
    const displayName = profile.displayName;
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    const userType = await getUserTypeByName(ROLES.Student);

    if (!userType) {
      return done(null, false, { message: 'Invalid user type' });
    }

    const type = userType.rows[0];

    let newUser = await pool.query(
      'INSERT INTO user_info (first_name, last_name, usertype_id, github_userId) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstName, lastName, type.id, profile.id]
    );
    const createdUser = newUser.rows[0];

// Create a new object with selected properties
    const userForSession = {
      user_id: createdUser.user_id,
      role:ROLES.Student,
      githubId:profile.id
    };
    done(null, userForSession);
   }
   
  //console.log(profile);
  //const userObj = {
   //   id: 'lala',
    // id: queryResult.rows.length? queryResult.rows[0].id : undefined,
    //username: profile.user.username,
    //provider: profile.user.provider,
 //   username: profile.username,
   // github_Id:profile.id,
   // accessToken: accessToken // Access token is now available from req
  //};
  //console.log("user",userObj);
  //done(null, newUser);
} 
));

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

//client id - ec7935c4e8874cdc73a6
//client secret - 315cfb21143bbe6507da352dbacabab8c8f5a43e