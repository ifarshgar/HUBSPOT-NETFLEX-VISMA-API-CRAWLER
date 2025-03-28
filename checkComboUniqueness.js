import fs from 'fs';

// Get the filename and attribute names from command line arguments
const [filename, attributeNames] = process.argv.slice(2);

if (!filename || !attributeNames) {
  console.error('Please provide both filename and attribute names.');
  console.log('Usage: node checkComboUniqueness.js <filename> "attribute1,attribute2,attribute3"');
  process.exit(1);
}

// Split the attribute names into an array
const attributes = attributeNames.split(',').map((attr) => attr.trim());

// Read and parse JSON file
try {
  const data = await fs.promises.readFile(filename, 'utf8');
  const jsonData = JSON.parse(data);
  const items = jsonData.Item;

  if (!items || !Array.isArray(items)) {
    console.error('Invalid JSON structure: "Item" array not found.');
    process.exit(1);
  }

  // First, check which requested attributes actually exist in the data
  const availableAttributes = new Set();
  items.forEach((item) => {
    Object.keys(item).forEach((key) => availableAttributes.add(key));
  });

  const missingAttributes = attributes.filter((attr) => !availableAttributes.has(attr));

  if (missingAttributes.length > 0) {
    console.error(
      `\n⚠️ Warning: The following requested attributes do not exist in the data: ${missingAttributes.join(
        ', '
      )}`
    );
    console.log('Available attributes:', [...availableAttributes].join(', '));
    process.exit(1);
  }

  // Track seen combined attribute values
  const seenValues = new Map(); // Store first occurrence of each combination
  const duplicates = new Map(); // Store duplicate items
  let missingCount = 0;
  let totalRecordsProcessed = 0;

  // Check for duplicates
  items.forEach((item) => {
    totalRecordsProcessed++;

    // Check if all attributes exist in the current item
    const missingInItem = attributes.filter((attr) => !item.hasOwnProperty(attr));
    if (missingInItem.length > 0) {
      missingCount++;
      return;
    }

    // Create a combined key from all attribute values
    const combinedKey = attributes.map((attr) => item[attr]).join('|');

    if (seenValues.has(combinedKey)) {
      // If we've seen this combination before, add to duplicates
      if (!duplicates.has(combinedKey)) {
        // Add the first occurrence to duplicates
        duplicates.set(combinedKey, [seenValues.get(combinedKey)]);
      }
      // Add the current duplicate
      duplicates.get(combinedKey).push(item);
    } else {
      seenValues.set(combinedKey, item);
    }
  });

  // Calculate statistics
  const uniqueCombinations = seenValues.size - duplicates.size;
  const duplicateCombinations = duplicates.size;
  const duplicateRecords = Array.from(duplicates.values()).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  // Print duplicate records if they exist
  if (duplicates.size > 0) {
    console.log(
      `❌ Found ${duplicateCombinations} duplicate combinations of ${attributes.join(' + ')}:`
    );

    duplicates.forEach((items, key) => {
      const values = key.split('|');
      console.log(
        `\nCombination: ${attributes.map((attr, i) => `${attr}=${values[i]}`).join(', ')}`
      );
      console.log(`Found in ${items.length} records:`);

      // Print all duplicate items
      items.forEach((item, index) => {
        console.log(`- Record ${index + 1}:`);
        console.log(JSON.stringify(item, null, 2));
      });
    });
  } else {
    console.log(`✅ All combinations of \`${attributes.join(' + ')}\` are unique.`);
  }

  // Print processing summary
  console.log('\nProcessing Summary:');
  console.log('-------------------');
  console.log(`Total records checked: ${totalRecordsProcessed}`);
  console.log(`Records missing any of the attributes: ${missingCount}`);
  console.log(`Unique combinations found: ${uniqueCombinations}`);
  console.log(`Duplicate combinations found: ${duplicateCombinations}`);
  console.log(`Total duplicate records: ${duplicateRecords}`);
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
