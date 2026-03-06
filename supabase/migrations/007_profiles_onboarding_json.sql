-- Adiciona uma coluna JSONB para armazenar todas as respostas dinâmicas do onboarding sem criar dezenas de colunas
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_answers JSONB DEFAULT '{}'::jsonb;
