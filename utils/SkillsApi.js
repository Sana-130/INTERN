const request = require('request');
require("dotenv").config();

let acess_T = null;
const authenticate = () => {
  const options = {
    method: 'POST',
    url: 'https://auth.emsicloud.com/connect/token',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    form: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'emsi_open'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    try{
      const responseObj = JSON.parse(body);
      //console.log(body.access_token, body);
      acess_T = responseObj.access_token;
    }catch(err){
      console.log(err);
    }
  });
  
};

const search = (param) =>{
  
  const options = {
    method: 'GET',
    url: 'https://emsiservices.com/skills/versions/latest/skills',
    qs: {q: param , typeIds: 'ST1,ST2', fields: 'name', limit: '5'},
    headers: {Authorization: `Bearer ${acess_T}`}
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body.data.map(item => item.name));
  });
}
  
  module.exports = {
    authenticate,
    search
  };