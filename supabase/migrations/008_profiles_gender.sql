-- Adiciona a coluna gender na tabela profiles para salvar a seleção de Gênero do usuário
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Prefiro não informar';
