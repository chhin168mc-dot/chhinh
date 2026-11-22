const fs = require("fs");
const path = require("path");

// ប្តូរ URL នេះទៅជា API Backend របស់អ្នក (ឧទាហរណ៍ http://localhost:3000/api/health)
const API_URL = process.env.API_URL || "https://jsonplaceholder.typicode.com/todos/1";

async function testBackendApi(url) {
  const start = Date.now();
  try {
    const response = await fetch(url);
    const durationMs = Date.now() - start;
    const rawBody = await response.text();

    let formattedBody = rawBody;
    try {
      formattedBody = JSON.stringify(JSON.parse(rawBody), null, 2);
    } catch {
      // រក្សាជា text ធម្មតា បើមិនមែន JSON
    }

    return {
      url,
      isWorking: response.ok,
      statusCode: response.status,
      durationMs,
      errorMessage: response.ok ? "None" : `HTTP ${response.status} (${response.statusText})`,
      body: formattedBody.slice(0, 1500)
    };
  } catch (err) {
    return {
      url,
      isWorking: false,
      statusCode: "N/A",
      durationMs: Date.now() - start,
      errorMessage: err.message || String(err),
      body: ""
    };
  }
}

function buildReportHTML(result) {
  const badgeText = result.isWorking ? "API ដំណើរការ (UP)" : "API មិនដំណើរការ (DOWN)";
  const badgeColor = result.isWorking ? "#166534" : "#991b1b";
  const badgeBg = result.isWorking ? "#dcfce7" : "#fee2e2";

  return `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8" />
  <title>API Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f9; padding: 30px; }
    .card { max-width: 700px; margin: auto; background: #fff; padding: 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: bold; color: ${badgeColor}; background: ${badgeBg}; }
    pre { background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="card">
    <h1>លទ្ធផល Test API Backend</h1>
    <span class="badge">${badgeText}</span>
    <p><strong>Endpoint:</strong> ${result.url}</p>
    <p><strong>Status Code:</strong> ${result.statusCode} | <strong>Time:</strong> ${result.durationMs}ms</p>
    <p><strong>Error / Note:</strong> ${result.errorMessage}</p>
    <h3>Response Preview:</h3>
    <pre>${result.body.replace(/</g, "&lt;")}</pre>
  </div>
</body>
</html>`;
}

async function run() {
  const result = await testBackendApi(API_URL);
  const distDir = path.join(__dirname, "dist");
  const outHtml = path.join(distDir, "index.html");

  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(outHtml, buildReportHTML(result), "utf8");

  if (result.isWorking) {
    console.log(`✅ API ដំណើរការ (${result.statusCode}) - ${result.durationMs}ms`);
    console.log(`📄 បានបង្កើត ${outHtml}`);
    process.exit(0);
  } else {
    console.error(`❌ API មិនដំណើរការ: ${result.errorMessage}`);
    console.log(`📄 បានបង្កើតរបាយការណ៍នៅ ${outHtml}`);
    process.exit(1);
  }
}

run();
