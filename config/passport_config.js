const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../db');
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require("dotenv").config();

const opts = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.jwtSecret,
};

//local stratergy for authentication with email and password
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await pool.query('SELECT * FROM user_info WHERE email = $1', [email]);
  
        if (user.rows.length === 0) {
          return done(null, false, { message: 'Invalid email or password' });
        }
  
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
  
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        const userRole = await pool.query("SELECT role FROM userType WHERE id = $1", [user.rows[0].usertype_id]);
        if (!userRole.rows.length) {
        return done(null, false, { message: 'Invalid role' });
        }

      // Add the role information to the user object
        user.rows[0].role = userRole.rows[0].role;
  
        return done(null, user.rows[0]);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try{
        const user = await pool.query('SELECT * FROM user_info where user_id = $1', [jwtPayload.user.id] );
        if (user.rows.length === 0) {
          return done(null, false);
        }
        // Add role information to the user object
        user.rows[0].role = jwtPayload.user.role;
  
        return done(null, user.rows[0]);
      }catch(err){
        return done(err, false);
      }
    })
  )

  passport.serializeUser((user, done)=>{
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) =>{
    try{
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        done(null, user.rows[0]);
    }catch(err){
        done(err);
    }
  });