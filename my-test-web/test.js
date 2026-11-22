const http = require('http');
const { spawn } = require('child_process');

// ចាប់ផ្តើមបើក Server
const server = spawn('node', ['server.js']);

setTimeout(() => {
    // តេស្តទី ១៖ ពិនិត្យមើលទំព័រ HTML (/)
    http.get('http://localhost:3000', (res) => {
        if (res.statusCode !== 200) {
            console.error('❌ បរាជ័យ៖ មិនអាចបើកទំព័រ HTML បានទេ');
            server.kill();
            process.exit(1);
        }
        console.log('✅ ជោគជ័យ៖ ទំព័រ HTML ដំណើរការធម្មតា (Status 200)');

        // តេស្តទី ២៖ ពិនិត្យមើល API (/api/hello)
        http.get('http://localhost:3000/api/hello', (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                const json = JSON.parse(data);
                if (apiRes.statusCode === 200 && json.message) {
                    console.log('✅ ជោគជ័យ៖ API ដំណើរការធម្មតា ->', json.message);
                    server.kill();
                    process.exit(0); // បញ្ចប់ដោយជោគជ័យ
                } else {
                    console.error('❌ បរាជ័យ៖ API មានបញ្ហា');
                    server.kill();
                    process.exit(1);
                }
            });
        });
    }).on('error', (err) => {
        console.error('❌ Server មិនដំណើរការ៖', err.message);
        server.kill();
        process.exit(1);
    });
}, 2000); // រង់ចាំ ២ វិនាទីឱ្យ Server បើកសិន
