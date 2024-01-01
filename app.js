const express = require("express");
const app = express();
const passport = require("passport");
const session = require('express-session');
const cors = require("cors");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

require('./config/passport_config');

app.use(session({
    secret: process.env.jwtSecret, // Replace with a strong, random string
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());


//routes
app.use('/', require("./routes/auth.routes"));
app.use('/employer', require("./routes/company.routes"));
app.use('/project', require("./routes/repo.routes"));
app.use('/internship', require("./routes/internship.routes"));
app.use('/user', require('./routes/user.routes'));
app.use('/skills', require('./routes/skills.routes'));

//app.use('/companies', require("./routes/company.routes"));
//app.use('/internship', require("./routes/internship.routes"));
//app.use('/', require("./routes/user.routes"));


app.listen(5000, ()=>{
    console.log(`Server is starting on port 5000`);
})
