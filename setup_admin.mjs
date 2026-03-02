import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'gui.devwork.admin@gmail.com';
    const password = 'Gui@lim4';

    console.log(`1. Criando ou autenticando usuário: ${email}...`);

    // Tenta fazer o signup primeiro
    let { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Guilherme Admin'
            }
        }
    });

    if (authError) {
        console.log('Signup falhou. Detalhes do erro:', authError);
    } else {
        console.log('Signup feito com sucesso!');
    }

    // Faz o login para pegar a sessão e o ID
    let { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email, password
    });

    if (loginError) {
        console.error('ERRO FATAL: Falha no login após criação. Erro:', loginError.message);
        return;
    }

    const userId = loginData.user.id;
    console.log(`\n2. Usuário conectado! ID: ${userId}`);
    console.log(`Promovendo a Administrador na tabela profiles...`);

    // Como estamos logados com o próprio usuário, a RLS permite darmos update no próprio perfil
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email: email,
            full_name: 'Guilherme',
            is_admin: true
        }, { onConflict: 'id' })
        .select()
        .single();

    if (profileError) {
        console.error('ERRO ao salvar privilégios de Admin:', profileError.message);
    } else {
        console.log('SUCESSO TOTAL! Perfil admin atualizado:', profileData);
        console.log('\n✅ VOCE JÁ PODE FAZER O LOGIN no painel em http://localhost:3000/admin/login');
    }
}

createAdmin();
