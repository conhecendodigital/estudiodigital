-- Adicionar coluna de status para o tracking do fluxo n8n -> Next.js
ALTER TABLE public.vault_references
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'DOWNLOAD_COMPLETE', 'FINALIZADO', 'ERRO'));

-- Permitir que o app insira com status PENDENTE e também atualize (necessário para o n8n via service role ou API client).
-- A política atual já permite INSERT e UPDATE do dono da linha, o que é perfeito para o frontend.
-- Caso o n8n use anon/auth, ele precisaria autenticar. Se usar Service Role Key, ignora RLS.
