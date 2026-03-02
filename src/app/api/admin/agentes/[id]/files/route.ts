import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase, user } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>>; user: { id: string } };

    const { id: agentId } = await params;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const fileName = file.name;
        // Clean filename and add timestamp
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const timestamp = Date.now();
        const storagePath = `${agentId}/${timestamp}-${cleanFileName}`;

        // Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
            .from('knowledge_base')
            .upload(storagePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (storageError) {
            throw new Error(`Erro no upload: ${storageError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('knowledge_base')
            .getPublicUrl(storagePath);

        // Insert into agent_files
        const fileType = fileName.split('.').pop()?.toUpperCase() || 'FILE';
        const fileSizeStr = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`;

        const { data: fileRecord, error: dbError } = await supabase
            .from('agent_files')
            .insert({
                agent_id: agentId,
                file_name: fileName,
                file_type: fileType,
                file_size: fileSizeStr,
                file_url: publicUrl,
                storage_path: storagePath,
                uploaded_by: user.id
            })
            .select()
            .single();

        if (dbError) {
            // Se falhou no DB, limpa no Storage por segurança
            await supabase.storage.from('knowledge_base').remove([storagePath]);
            throw new Error(`Erro no banco de dados: ${dbError.message}`);
        }

        return NextResponse.json({ file: fileRecord }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Erro inesperado' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { id: agentId } = await params;

    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json({ error: 'ID do arquivo não fornecido' }, { status: 400 });
        }

        // Buscar dados do arquivo para saber o path no storage
        const { data: fileRecord, error: fetchError } = await supabase
            .from('agent_files')
            .select('storage_path')
            .eq('id', fileId)
            .eq('agent_id', agentId)
            .single();

        if (fetchError || !fileRecord) {
            return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
        }

        // Remover do Storage
        if (fileRecord.storage_path) {
            const { error: storageError } = await supabase.storage
                .from('knowledge_base')
                .remove([fileRecord.storage_path]);

            if (storageError) {
                console.error("Erro ao remover do storage:", storageError);
                // Continua para tentar remover do DB mesmo se falhar no storage
            }
        }

        // Remover do DB
        const { error: dbError } = await supabase
            .from('agent_files')
            .delete()
            .eq('id', fileId);

        if (dbError) {
            throw new Error(`Erro ao deletar registro: ${dbError.message}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Erro inesperado' }, { status: 500 });
    }
}
