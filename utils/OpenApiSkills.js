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
      //console.log("access token",body.access_token, body);
      acess_T = responseObj.access_token;
    }catch(err){
      console.log(err);
    }
  });
  
};

const search = (param) =>{
  return new Promise((resolve, reject) => {
  const options = {
    method: 'GET',
    url: 'https://emsiservices.com/skills/versions/latest/skills',
    qs: {q: param , typeIds: 'ST1', fields: 'id,name,type,infoUrl', limit: '5'},
    headers: {Authorization: `Bearer ${acess_T}`}
  };
  
  request(options, function (error, response, body) {
    if (error){
      reject(error);
      return;
    }
    
    const parsedData = JSON.parse(body);
    // Access the "data" attribute
    const data = parsedData.data;
    //const pattern =/\(.*\b(?:Library|Framework)\b.*\)/;
   // const matchingItem = data.forEach(item => {
      //if (pattern.test(item.name)) {
      //  console.log(item.name);
     // }
    //});
    const allItem = data.map(item => item.name);
    resolve(allItem);
    
  });
});
}
  
  module.exports = {
    authenticate,
    search
  };