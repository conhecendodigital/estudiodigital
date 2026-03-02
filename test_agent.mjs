import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase
        .from('agents')
        .insert({
            name: 'Agent Test DB',
            description: 'Testing DB',
            created_by: null
        })
        .select()
        .single();

    if (error) {
        console.error('DB Insert Error:', error);
    } else {
        console.log('DB Insert Success:', data);
    }
}

test();
