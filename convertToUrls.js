const fs = require('fs').promises;
const path = require('path');

const directoryPath = './animalJson';
const domain = "https://cdn.xiaonail.com";


const parseDataToUrls = async (data, fileName) => {
  const links = [];

  try {
    const jsonData = JSON.parse(data);
    jsonData.res.data.forEach(item => {
      links.push(`${domain}/${item.iconSvg2Path}`)
    })

    await arrayToTextFile("./animalTxt/" + fileName + ".txt", links)
  } catch (parseError) {
    console.error(parseError)
  }
}

const main = async () => {
  try {
    const files = await fs.readdir(directoryPath);

    for (const fileName of files) {
      const filePath = path.join(directoryPath, fileName);

      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        // Process the file here
        const data = await fs.readFile(filePath, 'utf8')
        await parseDataToUrls(data, fileName.replace(/\.[^.]+$/, ''))
        // You can read the contents of the file or perform any other operation here
        // Example: const data = await fs.readFile(filePath, 'utf8');
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

main()



// const links = []
// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   // The data variable now contains the contents of the JSON file as a string.
//   // You can parse it into a JavaScript object using JSON.parse() if needed.

//   try {
//     const jsonData = JSON.parse(data);
//     jsonData.res.data.forEach(item => {
//       links.push(`${domain}${item.modelSvg2Path}`)
//     })
//     arrayToTextFile("./bubbleWater.txt", links)
//   } catch (parseError) {
//     console.error('Error parsing JSON:', parseError);
//   }
// });



async function arrayToTextFile(filePath, dataArray) {
  // Convert the array of strings into a single string with each element on a new line.
  const textData = dataArray.join('\n');

  // Write the text data to the file.
  try {
    await fs.writeFile(filePath, textData, 'utf8');
    console.log('Array written to the file successfully.');
  } catch (err) {
    console.error('Error writing to the file:', err);
  }
}