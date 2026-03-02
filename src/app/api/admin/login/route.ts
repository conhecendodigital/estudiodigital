import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// POST /api/admin/login — Autenticar admin via Supabase
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
            { error: 'Email e senha são obrigatórios' },
            { status: 400 }
        );
    }

    // Autenticar via Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError || !authData.user) {
        return NextResponse.json(
            { error: 'Credenciais inválidas' },
            { status: 401 }
        );
    }

    // Verificar se é admin
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_admin')
        .eq('id', authData.user.id)
        .single();

    if (profileError || !profile?.is_admin) {
        // Sign out se não é admin
        await supabase.auth.signOut();
        return NextResponse.json(
            { error: 'Acesso negado. Permissão de administrador necessária.' },
            { status: 403 }
        );
    }

    return NextResponse.json({
        success: true,
        user: {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            is_admin: profile.is_admin,
        },
        session: authData.session,
    });
}
