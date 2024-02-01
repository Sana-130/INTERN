const axios = require('axios');
const path = require('path');
const extract = require('extract-zip')
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const downloadDir = './downloads'; 

async function downloadZip(owner, repo) {

    const zipFileName = `${repo}.zip`;
    const filePath = path.join(downloadDir, zipFileName);

    const branch = 'main';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`; 
    try {
      const response = await axios({
        method: 'get',
        url: apiUrl,
        responseType: 'stream',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });
  
      const fileStream = fs.createWriteStream(filePath);
      response.data.pipe(fileStream);
  
      return new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Error downloading ZIP file: ${error.message}`);
    }
  }
  
  //targetfolder should have a name like 'ex-reponame
  async function extractZip(repo) {
    console.log("finished downloading");
    const zipFileName = `${repo}.zip`;
    const zipFilePath = path.join(downloadDir, zipFileName);
    const target = path.resolve(`downloads/ex-${repo}`);
    const targetFolder = path.join(downloadDir, `ex-${repo}`);
    try {
      try {
        await fs.promises.access(targetFolder);
      } catch (error) {
        // Directory doesn't exist, create it
        await fs.promises.mkdir(targetFolder, { recursive: true });
      }
  
      return new Promise((resolve, reject) => {
        extract(zipFilePath, { dir: target }, (err) => {
          if (err) {
            reject(new Error(`Error extracting ZIP file: ${err.message}`));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      throw new Error(`Error creating target folder: ${error.message}`);
    }
  }

  async function getLOC(repo){
    try {
      const command = `scc -c --format json downloads/ex-${repo}`;
      const { stdout, stderr } = await exec(command);
  
      if (stderr) {
        throw new Error(`Error executing command: ${stderr}`);
      }
  
      // Parse the JSON output
      const result = JSON.parse(stdout);

      const selectedLanguages = {
        lang: [ 'JavaScript', 'HTML']
        // Add other languages as needed
      };
      
      const filteredResult = result.filter(item => selectedLanguages.lang.includes(item.Name));
      
      // Extract lines of code from the filtered result
      const linesOfCode = filteredResult.map(item => ({
        Name: item.Name,
        LinesOfCode: item.Code
      }));
      
      console.log(linesOfCode);  
      // Do something with the result
      //console.log(result);
  
      //return result;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async function cpDetect(repo, lang){
    try{
      let langL = lang.toLowerCase();
      let command = `jscpd -s downloads/ex-${repo} -f ${langL}`;
      const { stdout, stderr } = await exec(command);
  
      if (stderr) {
        throw new Error(`Error executing command: ${stderr}`);
      }
  
      const match = stdout.match(/(\d+(\.\d+)?)%/);

      if (match) {
        const percentage = parseFloat(match[1]);
        console.log(`${langL}: ${percentage}%`);
      } else {
        console.log('Percentage not found in the output.');
      }

    }catch(err){
      console.error(`Error: ${err.message}`);
      throw err;
    }
  }

  /*async function getLOC(repo){
    try {

    }catch(error){
      console.error(`Error: ${error.message}`);
      throw error;
    }
  }*/

  const owner = 'Sana-130'
  const repo = 'FlappyBird_AI'
 /*downloadZip(owner, repo)
  .then(() => extractZip(repo))
  .then(() => console.log(`Downloaded and extracted successfully!`))
  .catch((error) => console.error(`Error: ${error.message}`));*/
  
cpDetect(repo, 'Python')
  .then(() => console.log("finished"));