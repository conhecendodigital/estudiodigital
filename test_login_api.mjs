import fetch from 'node-fetch';

async function testLogin() {
    const url = 'http://localhost:3000/api/admin/login';

    // Test with standard expected credentials (it may fail, but we'll see the exact error)
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@admin.com.br', password: 'Meusaas2811' })
    });

    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text}`);
}

testLogin();
