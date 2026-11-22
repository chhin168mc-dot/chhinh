const http = require('http');
const { spawn } = require('child_process');

// ចាប់ផ្តើមបើក Server
const server = spawn('node', ['server.js']);

// បង្ហាញ Error ប្រសិនបើ server.js មានបញ្ហា
server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
});

function runTest(retries = 5) {
    // ប្រើ 127.0.0.1 ជំនួស localhost ដើម្បីចៀសវាងបញ្ហា IPv6 លើ Ubuntu
    http.get('http://127.0.0.1:3000', (res) => {
        if (res.statusCode !== 200) {
            console.error('❌ បរាជ័យ៖ មិនអាចបើកទំព័រ HTML បានទេ');
            server.kill();
            process.exit(1);
        }
        console.log('✅ ជោគជ័យ៖ ទំព័រ HTML ដំណើរការធម្មតា (Status 200)');

        // តេស្តទី ២៖ ពិនិត្យមើល API (/api/hello)
        http.get('http://127.0.0', (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                const json = JSON.parse(data);
                if (apiRes.statusCode === 200 && json.message) {
                    console.log('✅ ជោគជ័យ៖ API ដំណើរការធម្មតា ->', json.message);
                    server.kill();
                    process.exit(0);
                } else {
                    console.error('❌ បរាជ័យ៖ API មានបញ្ហា');
                    server.kill();
                    process.exit(1);
                }
            });
        });
    }).on('error', (err) => {
        // ព្យាយាមភ្ជាប់ម្តងទៀតរៀងរាល់ ១ វិនាទី ប្រសិនបើ Server មិនទាន់បើករួច
        if (retries > 0) {
            setTimeout(() => runTest(retries - 1), 1000);
        } else {
            console.error('❌ Server មិនដំណើរការ៖', err.message || err);
            server.kill();
            process.exit(1);
        }
    });
}

// ចាប់ផ្តើមតេស្តបន្ទាប់ពីរង់ចាំ ១ វិនាទី
setTimeout(() => runTest(), 1000);
