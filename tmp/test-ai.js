const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    if (line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
        env[key.trim()] = value;
    }
});

async function testProvider(name, url, headers, model) {
    const start = Date.now();
    console.log(`Testing ${name}...`);
    try {
        let body;
        if (name.includes("Gemini")) {
            body = JSON.stringify({
                contents: [{ parts: [{ text: "Say 'Hello, I am fast!' in 5 words." }] }],
                generationConfig: { maxOutputTokens: 50 }
            });
        } else {
            body = JSON.stringify({
                model: model,
                messages: [{ role: "user", content: "Say 'Hello, I am fast!' in 5 words." }],
                max_tokens: 50
            });
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            const err = await response.text();
            return { name, success: false, error: `${response.status} - ${err.substring(0, 50)}...` };
        }

        const data = await response.json();
        const end = Date.now();
        return { name, success: true, time: ((end - start) / 1000).toFixed(2) + 's' };
    } catch (e) {
        return { name, success: false, error: e.message };
    }
}

async function run() {
    const tests = [
        {
            name: "OpenRouter",
            url: "https://openrouter.ai/api/v1/chat/completions",
            headers: { 
                Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            model: env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free"
        },
        {
            name: "Groq",
            url: "https://api.groq.com/openai/v1/chat/completions",
            headers: { 
                Authorization: `Bearer ${env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            model: "llama-3.1-8b-instant"
        },
        {
            name: "Cerebras",
            url: "https://api.cerebras.ai/v1/chat/completions",
            headers: { 
                Authorization: `Bearer ${env.CEREBRAS_API_KEY}`,
                "Content-Type": "application/json"
            },
            model: "llama3.1-8b"
        },
        {
            name: "Gemini",
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GOOGLE_AI_KEY}`,
            headers: { "Content-Type": "application/json" },
            model: "gemini-2.0-flash"
        },
        {
            name: "xAI",
            url: "https://api.x.ai/v1/chat/completions",
            headers: { 
                Authorization: `Bearer ${env.XAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            model: "grok-2-1212"
        }
    ];

    const results = [];
    for (const test of tests) {
        const key = Object.values(env).find(v => test.headers.Authorization?.includes(v) || test.url.includes(v));
        if (!key) {
            console.log(`Skipping ${test.name} - No key found in env`);
            continue;
        }
        results.push(await testProvider(test.name, test.url, test.headers, test.model));
    }

    console.log("\n--- BENCHMARK RESULTS ---");
    for (const res of results) {
        if (res.success) {
            console.log(`✅ ${res.name}: ${res.time}`);
        } else {
            console.log(`❌ ${res.name}: FAILED - ${res.error}`);
        }
    }
    fs.writeFileSync(path.resolve(__dirname, 'benchmark.json'), JSON.stringify(results, null, 2));
    console.log(`\nFull results saved to tmp/benchmark.json`);
    console.log("-------------------------\n");
}

run();
