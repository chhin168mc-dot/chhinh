// បង្កើត Function សម្រាប់ Render កូដ HTML
function generateHTMLView(data) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="km">
    <head>
      <meta charset="UTF-8">
      <title>${data.title}</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        p { color: #555; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${data.heading}</h1>
        <p>${data.message}</p>
        <p><strong>Status:</strong> ${data.status}</p>
      </div>
    </body>
    </html>
  `;
  return htmlContent;
}

// ទិន្នន័យ Test
const testData = {
  title: "HTML View Test Page",
  heading: "សួស្តី! នេះជាការ Test HTML View ចេញពី JS",
  message: "កូដ HTML ត្រូវ បានបង្កើត និងរៀបចំយ៉ាងត្រឹមត្រូវនៅក្នុង Node.js context!",
  status: "Success (Passed)"
};

// ដំណើរការបង្កើត HTML
const renderedHTML = generateHTMLView(testData);

// បង្ហាញ HTML លទ្ធផលនៅលើ Console
console.log("=== START GENERATED HTML VIEW ===");
console.log(renderedHTML);
console.log("=== END GENERATED HTML VIEW ===");

// ពិនិត្យលក្ខខណ្ឌ Test (Assertion)
if (renderedHTML.includes("<h1>សួស្តី! នេះជាការ Test HTML View ចេញពី JS</h1>")) {
  console.log("✅ Test Passed: HTML generated correctly.");
  process.exit(0);
} else {
  console.error("❌ Test Failed: HTML output missing expected tags.");
  process.exit(1);
}
