-- ============================================================
-- Estúdio Digital — Migration 002: Storage Buckets
-- Criado em: 2026-03-02
-- Descrição: Criação do storage bucket para a base de conhecimento (RAG)
-- ============================================================

-- Insere o bucket se ele não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge_base', 'knowledge_base', true)
ON CONFLICT (id) DO NOTHING;

-- Configuração de RLS para o bucket
-- Permite leitura de arquivos
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'knowledge_base' );

-- Admins podem fazer upload (via rotas API autenticadas)
CREATE POLICY "Admin Uploads"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'knowledge_base' );

-- Admins podem deletar/atualizar
CREATE POLICY "Admin Delete/Update"
    ON storage.objects FOR ALL
    USING ( bucket_id = 'knowledge_base' );
