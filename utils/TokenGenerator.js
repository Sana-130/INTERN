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

function tokenJwt(token){
  const payload = {
    token : token
  }
  return jwt.sign(payload, process.env.jwtSecret, {expiresIn : "1h"});
}

function verifyToken(token){
  try{
    const decodedToken = jwt.verify(token, process.env.jwtSecret);
    return decodedToken;
  }catch(err){
    console.log(err);
    return false;
  }
}

function createRefreshToken(userId){
    const createRefreshToken = jwt.sign(
        {
            user : { id : userId },
        },
        process.env.REF_SECRET,
        {
          expiresIn: '1d',
        },
      );
      return createRefreshToken;
}

const refreshTokens = async(token, refreshToken) => {
    let userId = -1;
    try {
      const { user: { id } } = jwt.decode(refreshToken);
      userId = id;
    } catch (err) {
      return {};
    }
  
    if (!userId) {
      return {};
    }
  
    const user = "user";//await //find user
  
    if (!user) {
      return {};
    }
  
    const refreshSecret = SECRET_2 + user.password;
  
    try {
      jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return {};
    }
  
    const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user,
    };
  
}


module.exports ={jwtGenerator, createRefreshToken, tokenJwt, verifyToken};
