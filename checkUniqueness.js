const fs = require('fs');

// Get the filename and attribute name from command line arguments
const [filename, attributeName] = process.argv.slice(2);

if (!filename || !attributeName) {
  console.error('Please provide both filename and attribute name.');
  console.log('Usage: node script.js <filename> <attributeName>');
  process.exit(1);
}

// Read the JSON file
fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const items = jsonData.data;

    if (!items || !Array.isArray(items)) {
      console.error('Invalid JSON structure: "Item" array not found.');
      return;
    }

    // Track seen attribute values
    const seenValues = new Set();
    const duplicates = new Set();
    let missingCount = 0;

    // Check for duplicates
    items.forEach((item) => {
      if (!item.hasOwnProperty(attributeName)) {
        missingCount++;
        return;
      }

      const value = item[attributeName];
      if (seenValues.has(value)) {
        duplicates.add(value);
      } else {
        seenValues.add(value);
      }
    });

    // Report results
    console.log(`\nResults for file: ${filename}`);
    console.log(`Checking duplicates in attribute: ${attributeName}\n`);

    if (duplicates.size === 0) {
      console.log(`✅ All \`${attributeName}\` values are unique.`);
    } else {
      console.log(`❌ Found ${duplicates.size} duplicate ${attributeName}(s):`);
      console.log(Array.from(duplicates).join(', '));
    }

    if (missingCount > 0) {
      console.log(`⚠️  ${missingCount} items are missing the ${attributeName} property.`);
    }

    console.log(`\nTotal records checked: ${items.length}`);
    console.log(`Unique ${attributeName} values found: ${seenValues.size}`);
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
