//'https://github.com/Sana-130/PAC-UNI'
//cloc --json --quiet --vcs=git https://github.com/Sana-130/PAC-UNI
//const cloc = require('cloc');
const jscpd = require('jscpd');
const util = require('util');
const { exec } = require('child_process');
const AdmZip = require('adm-zip');
const axios = require('axios');
const path = require('path');
const extract = require('extract-zip')

const execPromise = util.promisify(exec);
const githubUsername = 'python';
const repoName = 'cpython';
const fs = require('fs');

const downloadDirectory = './downloads'; 
const zipFileName = `${repoName}.zip`;
const zipFilePath = path.join(downloadDirectory, zipFileName);
const extractDirectoryName = `ex`; // Adjust prefix and format
const extractPath = path.join(downloadDirectory, extractDirectoryName);

const owner = 'python';
const repo = 'cpython';
const branch = 'main';
const extractToPath = path.resolve('downloads');
accessToken='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'


const repoAnalyze = async () => {
  try {
    // Run cloc analysis using the GitHub repository link
   /* const clocOptions = {
      path: repoLink,
      quiet: true,
      vcs: 'git',
    };

    const clocResult = await cloc(clocOptions);*/

    // Run jscpd analysis using the GitHub repository link
  const url = 'https://codeload.github.com/python/cpython/zip/refs/heads/main';



 
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;

  axios({
    method: 'get',
    url: apiUrl,
    responseType: 'stream',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      //'Authorization': `Bearer ${accessToken}`, // Provide a user-agent header as per GitHub API requirements
    },
  })
    .then(response => {
      // Save the stream to a file
      //const filePath = 'downloaded.zip';
      const fileStream = fs.createWriteStream(zipFilePath);
      response.data.pipe(fileStream);

      fileStream.on('finish', () => {
        console.log(`Downloaded ZIP file and saved to ${zipFilePath}`);
        //const zip = new AdmZip(`downloads/${repo}.zip`);
        //zip.extractAllTo(`downloads/`, true);
        //call();

      });
      
      
    })
    
    .catch(error => {
      console.error('Error downloading ZIP file:', error.message);
    });
    
      
    } catch (error) {
      console.error('Error running analysis:', error.message);
      throw new Error('Failed to analyze repository');
    }
  };

// Replace with your actual GitHub username and repository name

async function call () {
  try {
    console.log("callingg...")
    await extract(`downloads/${repo}.zip`, { dir: extractToPath })
    console.log('Extraction complete')
  } catch (err) {
    console.log(err);
    // handle any errors
  }
}
const repoLink = `https://github.com/${githubUsername}/${repoName}`;
//call();
repoAnalyze();
// Test the repoAnalyze function
//repoAnalyze(repoLink)
 // .then((result) => {
 //   console.log('Analysis Result:', result);
 /// })
 // .catch((error) => {
 //   console.error('Error:', error.message);
 // });
