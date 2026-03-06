const { createClient } = require('@supabase/supabase-js');
const url = 'https://qqshambzsmuhjvmrheue.supabase.co';
const key = 'sb_publishable_wVg7TUDzqWr66vVG5B21RQ__mz7ODHN';
const supabase = createClient(url, key);

async function run() {
  const { error } = await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS resumes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name TEXT NOT NULL,
        job_title TEXT,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT,
        linkedin TEXT NOT NULL,
        github TEXT,
        portfolio TEXT,
        summary TEXT NOT NULL,
        education JSONB NOT NULL,
        experience JSONB NOT NULL,
        projects JSONB DEFAULT '[]'::jsonb,
        certifications JSONB DEFAULT '[]'::jsonb,
        skills JSONB NOT NULL,
        generated_resume TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  if (error) {
    console.error('Error (might be expected if rpc not created):', error);
  } else {
    console.log('Success!');
  }
}
run();
