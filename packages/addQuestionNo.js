const fs = require('fs');
const path = require('path');

// Path to your JSON file
const filePath = path.join(__dirname, 'lessons', 'LessonSem2', 'Data', 'changeQuestionNo.json');

try {
  // Read and parse the JSON file
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  // Check if top-level is an array
  if (Array.isArray(data)) {
    // Add questionNo to each question
    data.forEach((q, index) => {
      q.questionNo = index + 1;
    });

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✅ Successfully added "questionNo" to each question.');
  } else {
    console.error('❌ Top-level JSON structure is not an array.');
  }

} catch (err) {
  console.error('❌ Failed to process the file:', err.message);
}
