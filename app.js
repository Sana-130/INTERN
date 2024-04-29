const express = require("express");
const app = express();
const passport = require("passport");
const session = require('express-session');
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("dotenv").config();

//middleware
app.use(cookieParser());
app.use(cors());

/*app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);*/


app.use(express.json());


require('./config/passport_config');

app.use(session({
    secret: process.env.jwtSecret, // Replace with a strong, random string
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly:true,
      secure: false,
      sameSite: 'none',
    },
  }));

app.use(passport.initialize());
app.use(passport.session());

/*app.use((req, res, next) => {
  `res.header('Access-Control-Allow-Credentials', true);   
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');` // your_frontend_domain, it's an example
  next()
});*/
//routes
app.use('/', require("./routes/auth.routes"));
app.use('/employer', require("./routes/company.routes"));
app.use('/project', require("./routes/repo.routes"));
app.use('/internship', require("./routes/internship.routes"));
app.use('/user', require('./routes/user.routes'));
app.use('/skills', require('./routes/skills.routes'));
app.use('/admin', require("./routes/admin.routes"));
//app.use('/companies', require("./routes/company.routes"));
//app.use('/internship', require("./routes/internship.routes"));
//app.use('/', require("./routes/user.routes"));


app.listen(5000, ()=>{
    console.log(`Server is starting on port 5000`);
})
