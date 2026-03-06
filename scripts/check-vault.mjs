import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Verificando schema da tabela vault_references...");

    // Try to select just to see if it works
    const { data, error } = await supabase.from('vault_references').select('*').limit(1);
    if (error) {
        console.error("Select error:", error);
    } else {
        console.log("Tabela existe! Linhas nela:", data.length);
        if (data.length > 0) {
            console.log("Colunas detectadas na primeira linha:", Object.keys(data[0]));
        }
    }

    // Tentar inserir com 'url' no lugar de 'url_original' para testar se a coluna tem outro nome
    console.log("Testando insert cego para forçar erro de schema...");
    const { error: err1 } = await supabase.from('vault_references').insert([{ url_original: 'test', video_path: 'test', user_id: '00000000-0000-0000-0000-000000000000' }]);
    console.log("Erro ao tentar url_original:", err1?.message);

    const { error: err2 } = await supabase.from('vault_references').insert([{ url: 'test', video_path: 'test', user_id: '00000000-0000-0000-0000-000000000000' }]);
    console.log("Erro ao tentar url:", err2?.message);

    const { error: err3 } = await supabase.from('vault_references').insert([{ link: 'test', video_path: 'test', user_id: '00000000-0000-0000-0000-000000000000' }]);
    console.log("Erro ao tentar link:", err3?.message);
}
check();
