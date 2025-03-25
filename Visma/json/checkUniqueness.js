const fs = require('fs');

// Read the JSON file
fs.readFile('Contact.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const items = jsonData.Item;

    if (!items || !Array.isArray(items)) {
      console.error('Invalid JSON structure: "Item" array not found.');
      return;
    }

    // Track seen AssociateNo values
    const seenAssociateNos = new Set();
    const duplicates = new Set();

    // Check for duplicates
    items.forEach((item) => {
      const associateNo = item.AssociateNo;
      if (seenAssociateNos.has(associateNo)) {
        duplicates.add(associateNo);
      } else {
        seenAssociateNos.add(associateNo);
      }
    });

    // Report results
    if (duplicates.size === 0) {
      console.log('✅ All `AssociateNo` values are unique.');
    } else {
      console.log(`❌ Found ${duplicates.size} duplicate AssociateNo(s):`, Array.from(duplicates));
    }

    console.log(`Total records checked: ${items.length}`);
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
