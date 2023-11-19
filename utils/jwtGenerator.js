const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, user_type){
    const payload = {
        user: {
            id: user_id,
            role: user_type
        }
    };

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1h"});
}

module.exports = jwtGenerator;
