import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser(email) {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, is_admin')
        .eq('email', email)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            console.log(`User ${email} not found in profiles table.`);
            return;
        }
        console.error('Error fetching profile:', error);
    } else {
        console.log('Profile found:', data);
    }
}

checkUser('admin@admin.com.br');
// test another hardcoded one just in case
checkUser('admin@test.com');
