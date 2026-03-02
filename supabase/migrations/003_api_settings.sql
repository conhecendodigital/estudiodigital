-- ============================================================
-- Estúdio Digital — Migration 003: API Settings & Logs
-- Criado em: 2026-02-28
-- Descrição: Tabelas para configuração de providers de IA,
--            gateways de pagamento e logs de requisições
-- ============================================================

-- ────────────────────────────────────────────
-- 1. API_SETTINGS (Chaves de API dos providers)
-- Origem: admin/integracoes (OpenAI, Anthropic, Google, OpenRouter)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    provider TEXT NOT NULL UNIQUE,       -- 'openai', 'anthropic', 'google', 'openrouter'
    display_name TEXT NOT NULL,          -- 'OpenAI', 'Anthropic', 'Google', 'OpenRouter (Open Source)'
    api_key TEXT,                        -- Chave de API (será criptografada via RLS)
    is_enabled BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    last_tested_at TIMESTAMPTZ,
    last_test_result BOOLEAN,            -- true = sucesso, false = erro
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER api_settings_updated_at
    BEFORE UPDATE ON api_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────
-- 2. GATEWAY_SETTINGS (Gateways de Pagamento)
-- Origem: admin/pagamentos (Hotmart, Kiwify, Stripe)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gateway_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    gateway TEXT NOT NULL UNIQUE,         -- 'hotmart', 'kiwify', 'stripe'
    display_name TEXT NOT NULL,           -- 'Hotmart', 'Kiwify', 'Stripe'
    is_enabled BOOLEAN DEFAULT FALSE,
    
    -- Campos dinâmicos (cada gateway tem campos diferentes)
    credentials JSONB DEFAULT '{}',       -- { "token": "...", "api_key": "...", etc }
    webhook_url TEXT,                     -- URL do webhook gerada
    
    -- Teste
    last_tested_at TIMESTAMPTZ,
    last_test_result BOOLEAN,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER gateway_settings_updated_at
    BEFORE UPDATE ON gateway_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────
-- 3. API_LOGS (Logs de Requisições de IA)
-- Origem: admin/requisicoes, admin/custos
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
    
    -- Request info
    provider TEXT NOT NULL,               -- 'openai', 'anthropic', 'google', 'openrouter'
    model TEXT NOT NULL,                  -- 'gpt-4o', 'claude-3.5-sonnet', etc.
    
    -- Tokens & Cost
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,6) DEFAULT 0,
    
    -- Response
    status_code INTEGER DEFAULT 200,      -- 200, 429, 500, etc.
    latency_ms INTEGER DEFAULT 0,
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_agent_id ON api_logs(agent_id);
CREATE INDEX idx_api_logs_provider ON api_logs(provider);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX idx_api_logs_status ON api_logs(status_code);

-- ────────────────────────────────────────────
-- 4. PLATFORM_CONFIG (Configurações Gerais)
-- Origem: admin/config (tab Geral)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    key TEXT NOT NULL UNIQUE,             -- 'platform_name', 'default_language', etc.
    value TEXT,
    value_json JSONB,                     -- Para valores complexos
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER platform_config_updated_at
    BEFORE UPDATE ON platform_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────
-- RLS POLICIES
-- ────────────────────────────────────────────

-- API Settings: apenas admins
ALTER TABLE api_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view api_settings"
    ON api_settings FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );
CREATE POLICY "Only admins can manage api_settings"
    ON api_settings FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Gateway Settings: apenas admins
ALTER TABLE gateway_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view gateway_settings"
    ON gateway_settings FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );
CREATE POLICY "Only admins can manage gateway_settings"
    ON gateway_settings FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- API Logs: admins veem tudo, users veem os próprios
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all api_logs"
    ON api_logs FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );
CREATE POLICY "Users can view own api_logs"
    ON api_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert api_logs"
    ON api_logs FOR INSERT WITH CHECK (true);

-- Platform Config: admins apenas
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view platform_config"
    ON platform_config FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );
CREATE POLICY "Only admins can manage platform_config"
    ON platform_config FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ────────────────────────────────────────────
-- SEED: Providers iniciais
-- ────────────────────────────────────────────
INSERT INTO api_settings (provider, display_name, is_enabled) VALUES
    ('openai', 'OpenAI', false),
    ('anthropic', 'Anthropic', false),
    ('google', 'Google', false),
    ('openrouter', 'OpenRouter (Open Source)', false)
ON CONFLICT (provider) DO NOTHING;

-- SEED: Gateways iniciais
INSERT INTO gateway_settings (gateway, display_name, is_enabled, webhook_url) VALUES
    ('hotmart', 'Hotmart', false, ''),
    ('kiwify', 'Kiwify', false, ''),
    ('stripe', 'Stripe', false, '')
ON CONFLICT (gateway) DO NOTHING;

-- ============================================================
-- FIM DA MIGRATION 003
-- ============================================================
