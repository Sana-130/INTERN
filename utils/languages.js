const axios = require('axios');
require("dotenv").config();

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
}

function capitalizeFirstLetter(inputString) {
  return `${inputString.charAt(0).toUpperCase()}${inputString.slice(1)}`;
}

const search = async (req, res) => {

    const userInput = capitalizeFirstLetter(req.query.input); // Assuming userInput is a parameter in the route
    console.log(req.query.input);
  // Ensure userInput is provided
    if (!userInput) {
        return res.status(400).json({ error: 'User input is required.' });
    }
    
    const where = encodeURIComponent(JSON.stringify({
      "ProgrammingLanguage": {
        "$regex": userInput
      }
    }));

  try {
    
    const response = await axios.get(
      `https://parseapi.back4app.com/classes/All_Programming_Languages?limit=5&where=${where}`,
      {
        headers: {
          'X-Parse-Application-Id': process.env.Back4AppId,
          'X-Parse-Master-Key': process.env.Master_key,
        }
      }
    );
    const data = response.data.results;
    
    const allItems = data.map(item => item.ProgrammingLanguage);
    return res.status(200).json({ allItems });
    
    
    //const parsedData =  JSON.parse(response);
    //const data = parsedData.data;
    //const data = response.data; 
    //console.log(data);
    //const allItem = data.map(item => item.ProgrammingLanguage);
    //return res.json({allItem});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = search;
