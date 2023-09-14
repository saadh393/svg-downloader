const cluster = require('cluster');
const numCPUs = require('os').cpus().length - 1 // Saving One Core for others ;
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { mkdirp } = require('mkdirp');
const cliProgress = require('cli-progress');


const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let current = 0;

const outputFolderPath = './Figuretxt'; // Replace with the path to your 'output' folder
const downloadFolderPath = './FigureDownloads'; // Replace with the path to your 'Downloads' folder

async function downloadSVGFiles(filesToDownload) {
  try {
    for (const outputFile of filesToDownload) {
      const txtFilePath = path.join(outputFolderPath, outputFile);
      const svgFolderName = path.basename(outputFile, '.txt'); // Get folder name from the .txt filename
      const svgFolderPath = path.join(downloadFolderPath, svgFolderName);

      // Create the folder if it doesn't exist
      await mkdirp(svgFolderPath);

      const urls = await fs.readFile(txtFilePath, 'utf8');
      const urlArray = urls.split('\n').map(url => url.trim());
      const downloadFiles = await fs.readdir(svgFolderPath)

      for (const url of urlArray) {
        try {
          const fileName = path.basename(url);
          if (!downloadFiles.includes(fileName)) {
            const response = await axios.get(url, { responseType: 'stream' });
            const filePath = path.join(svgFolderPath, fileName);

            // Save the SVG image with the appropriate filename
            await fs.writeFile(filePath, response.data);

            console.log(`Downloaded ${fileName} to ${svgFolderPath}`);
          }
        } catch (error) {
          console.error(`\nError downloading ${url}: ${error.message}`);
        }


      }
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

async function countTotalLinksInFolder(folderPath) {
  try {
    // Read the list of files in the specified folder
    const files = await fs.readdir(folderPath);

    let totalLinks = 0;

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        // Read the content of each file
        const fileContent = await fs.readFile(filePath, 'utf8');

        // Split the content by newline to count the number of links
        const links = fileContent.split('\n').map(link => link.trim());

        // Add the number of links in this file to the total count
        totalLinks += links.length;
      } catch (error) {
        console.error(`Error reading file ${file}: ${error.message}`);
      }
    }

    return totalLinks;
  } catch (error) {
    console.error(`Error reading folder ${folderPath}: ${error.message}`);
    return 0; // Return 0 in case of an error
  }
}

(async () => {
 
  if (cluster.isMaster) {
    const outputFiles = await fs.readdir(outputFolderPath);
    const chunks = [];

    // Get Total Number of Files to download 
    const total = await countTotalLinksInFolder(outputFolderPath)
    progressBar.start(total, current);

    // Divide the list of outputFiles into chunks
    for (let i = 0; i < numCPUs; i++) {
      const startIndex = Math.floor((i / numCPUs) * outputFiles.length);
      const endIndex = Math.floor(((i + 1) / numCPUs) * outputFiles.length);
      chunks.push(outputFiles.slice(startIndex, endIndex));
    }

    // Fork workers for each CPU core and assign a chunk of files to each worker
    for (let i = 0; i < numCPUs; i++) {
      const worker = cluster.fork();
      worker.send(chunks[i]);
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    // Each worker receives a chunk of files and runs the downloadSVGFiles function
    process.on('message', (chunk) => {
      downloadSVGFiles(chunk);
    });
  }


})()
