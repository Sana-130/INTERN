const fs = require('fs');
const { pool } = require('../db/db-service');

async function insertData() {
  try {
    // Load JSON data from the file
    const rawData = fs.readFileSync('D:/python_files/lang.json');
    const jsonData = JSON.parse(rawData);

    for (const result of jsonData.results) {
      const { ProgrammingLanguage } = result;

      const queryResult = await pool.query('INSERT INTO skill (name) VALUES ($1) RETURNING id', [ProgrammingLanguage]);

      console.log(`Row inserted with ID: ${queryResult.rows[0].id}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {

    pool.end();
  }
}
const view = () => {
    const rawData = fs.readFileSync('D:/python_files/lang.json');
    const jsonData = JSON.parse(rawData);
    //const results = jsonData.results;
    for (const result of jsonData.results) {
      const { ProgrammingLanguage , objectId } = result;
      const pattern = /^[a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;

      if (pattern.test( ProgrammingLanguage)) {
          
        } else {
          console.log("String contains unusual characters.", ProgrammingLanguage, objectId);
        }
    }

    //console.log(results[81]);
}


//insertData();
view();
