import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

type AdminAuthResult =
    | { error: NextResponse }
    | { user: { id: string; email?: string }; profile: { id: string; full_name: string; email: string; is_admin: boolean }; supabase: Awaited<ReturnType<typeof createClient>> };

/**
 * Verifica se o usuário atual é admin.
 * TODO: re-enable auth after testing
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            error: NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            ),
        };
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_admin')
        .eq('id', user.id)
        .single();

    if (profileError || !profile?.is_admin) {
        return {
            error: NextResponse.json(
                { error: 'Acesso negado. Permissão de administrador necessária.' },
                { status: 403 }
            ),
        };
    }

    return { user, profile, supabase };
}
