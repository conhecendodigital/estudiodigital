import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignIn() {
    console.log('Testing sign in with gui.devwork@gmail.com...');
    const res = await supabase.auth.signInWithPassword({
        email: 'gui.devwork@gmail.com',
        password: 'Gui@lim4'
    });
    console.log('Auth response:', JSON.stringify(res, null, 2));

    if (res.data?.user) {
        console.log('\nChecking profiles table for is_admin flag...');
        const profileRes = await supabase.from('profiles').select('*').eq('id', res.data.user.id).single();
        console.log('Profile response:', JSON.stringify(profileRes, null, 2));
    }
}

testSignIn();
