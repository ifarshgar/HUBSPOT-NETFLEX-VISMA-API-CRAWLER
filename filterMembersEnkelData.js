const fs = require('fs');

// Function to check if a value is null, undefined, empty string, or only whitespace
function isNullOrEmpty(value) {
  return (
    value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
  );
}

// Main processing function
function filterData(inputFilename, outputFilename) {
  try {
    // Read the input file
    const rawData = fs.readFileSync(inputFilename, 'utf8');
    const data = JSON.parse(rawData);

    // Filter the items
    const filteredItems = data.Item.filter((item) => {
      const licenseName = item['LisensNavn Medlem'];
      return !isNullOrEmpty(licenseName);
    });

    // Create the output object
    const outputData = { Item: filteredItems };

    // Write to the output file
    fs.writeFileSync(outputFilename, JSON.stringify(outputData, null, 2));
    console.log(`Successfully filtered data. Saved to ${outputFilename}`);

    return filteredItems.length;
  } catch (error) {
    console.error('Error processing files:', error.message);
    return 0;
  }
}

const inputFile = 'Visma/json/Member_enkel.json'; 
const outputFile = 'Visma/json/Member_enkel_filtered.json'; 

const keptRecords = filterData(inputFile, outputFile);
console.log(`Kept ${keptRecords} records after filtering.`);
