const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.includes('=') && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim().replace(/^["'](.*)["']$/, '$1');
        env[key.trim()] = value;
    }
});

const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
    console.log('Testing Supabase connection...');
    console.log('URL (stringified):', JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL));
    console.log('Anon Key (stringified prefix):', JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 15)));

    try {
        const { data, error } = await supabase.from('resumes').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Supabase error:', error.message);
            console.error('Details:', error);
        } else {
            console.log('✅ Supabase connected successfully!');
            console.log('Resumes count:', data);
        }

        // Test auth service specifically
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.error('❌ Auth service error:', authError.message);
        } else {
            console.log('✅ Auth service reachable.');
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

test();
