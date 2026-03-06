-- Adiciona a coluna analise_ia na tabela já existente do cliente.
ALTER TABLE public.vault_references
ADD COLUMN IF NOT EXISTS analise_ia JSONB;
