const fetch = require('node-fetch')
const fs = require('fs').promises;

const styleIcons = [
  {
      "category": "Flat",
      "id": 21
  },
  {
      "category": "Essay",
      "id": 19
  },
  {
      "category": "Technology",
      "id": 25
  },
  {
      "category": "Purple",
      "id": 28
  },
  {
      "category": "Stick",
      "id": 27
  },
  {
      "category": "chocolate",
      "id": 26
  },
  {
      "category": "Empty",
      "id": 24
  },
  {
      "category": "Bubble",
      "id": 5
  },
  {
      "category": "Jelly",
      "id": 1
  },
  {
      "category": "March",
      "id": 22
  },
  {
      "category": "Memphis",
      "id": 4
  },
  {
      "category": "Duotone",
      "id": 14
  },
  {
      "category": "Blue",
      "id": 8
  },
  {
      "category": "Pen",
      "id": 15
  },
  {
      "category": "Fantasy",
      "id": 11
  },
  {
      "category": "life",
      "id": 6
  },
  {
      "category": "Line ",
      "id": 2
  },
  {
      "category": "Candy",
      "id": 17
  },
  {
      "category": "Green",
      "id": 7
  },
  {
      "category": "Midnight",
      "id": 9
  },
  {
      "category": "Dance",
      "id": 20
  },
  {
      "category": "Yellow",
      "id": 3
  },
  {
      "category": "MBE",
      "id": 16
  },
  {
      "category": "3D",
      "id": 10
  },
  {
      "category": "ribbon",
      "id": 23
  },
  {
      "category": "Redblue",
      "id": 18
  },
  {
      "category": "Childlike",
      "id": 13
  },
  {
      "category": "Colorful",
      "id": 12
  }
];

const getUrl = (id) => `https://xiaonail.com/Api/Icon/getIconModelList?per=6000&page=1&keywords=&iconCategory=-1&isDraft=0&iconStyleCatID=${id}&isPopSort=1&userID=0&generateType=1&uid=0&partnerName=xyd&webSign=024b286a53a732e7e1ad44b55c817c67`
const getFigureUrl = id => `https://xiaonail.com/Api/Icon/getIconList?per=6000&page=1&iconStyleID=2&keywords=&iconCategory=-1&iconGender=-1&iconAction=0&iconStyleCatID=${id}&iconGroupID=0&isPopSort=1&uid=0&partnerName=xyd&webSign=2df4ab5548d3f07c85e8c37c6b10896a`
const getElementUrl = id => `https://xiaonail.com/Api/Icon/getIconList?per=60&page=1&iconStyleID=3&keywords=&iconCategory=-1&iconGender=-1&iconAction=0&iconStyleCatID=${id}&iconGroupID=0&isPopSort=1&uid=0&partnerName=xyd&webSign=2df4ab5548d3f07c85e8c37c6b10896a`

function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

async function writeFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data);
    await fs.writeFile(`./FigureJSONS/${filePath}.json`, jsonData, 'utf8');

    console.log('Array written to the file successfully.');
  } catch (err) {
    console.error('Error writing to the file:', err);
  }
}



// Function to fetch data from multiple URLs using a loop
async function fetchMultipleData(urls) {

  for (const url of urls) {
    const data = await fetchData(getFigureUrl(url.id));
    await writeFile(url.category, data)
  }

  return results;
}


fetchMultipleData(styleIcons)
  .then(dataArray => {
    console.log('Data from multiple requests:', dataArray);
  })
  .catch(error => {
    console.error('Error fetching data from multiple requests:', error);
  });