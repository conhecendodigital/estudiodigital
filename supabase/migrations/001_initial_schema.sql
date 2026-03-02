-- ============================================================
-- Estúdio Digital — Migration 001: Schema Inicial
-- Criado em: 2026-02-28
-- Descrição: Schema completo para a plataforma Estúdio Digital
-- ============================================================

-- ────────────────────────────────────────────
-- EXTENSÕES
-- ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────
CREATE TYPE subscription_status AS ENUM ('ativo', 'cancelado', 'inadimplente', 'trial');
CREATE TYPE plan_type AS ENUM ('mensal', 'anual');
CREATE TYPE agent_status AS ENUM ('ativo', 'inativo', 'em_breve');
CREATE TYPE agent_category AS ENUM ('vendas', 'copywriting', 'suporte', 'onboarding', 'analytics', 'educacao', 'produtividade', 'estrategico', 'conteudo');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE event_status AS ENUM ('pendente', 'concluido', 'cancelado');

-- ────────────────────────────────────────────
-- FUNÇÃO: auto-update updated_at
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. PROFILES (Usuários)
-- Origem: login, onboarding, perfil, admin/usuarios
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    
    -- Dados do onboarding
    company_name TEXT,          -- "Nome da sua empresa/marca"
    niche TEXT,                 -- "Qual seu nicho?"  
    role TEXT,                  -- "Qual seu papel?"
    goals TEXT,                 -- "Quais seus objetivos?"
    experience_level TEXT,      -- "Nível de experiência com IA"
    content_style TEXT,         -- "Estilo de conteúdo preferido"
    social_platforms TEXT[],    -- Plataformas que usa
    bio TEXT,
    website TEXT,
    
    -- Créditos
    credits_available INTEGER DEFAULT 0,
    credits_total INTEGER DEFAULT 0,
    credits_renewal_date TIMESTAMPTZ,
    
    -- Controle
    is_admin BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 2. PLANS (Planos de Assinatura)
-- Origem: admin/planos (Starter, Pro, Enterprise)
-- ============================================================
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                    -- "Starter", "Pro", "Enterprise"
    slug TEXT UNIQUE NOT NULL,             -- "starter", "pro", "enterprise"
    tier TEXT,                             -- "Iniciante", "Profissional", "Escalável"
    description TEXT,
    
    -- Preços
    price_monthly DECIMAL(10,2) NOT NULL,  -- 97.00, 197.00, 497.00
    price_yearly DECIMAL(10,2),            -- 997.00, 1997.00, 4997.00
    
    -- Créditos
    credits_quota INTEGER NOT NULL,         -- 100000, 500000, -1 (ilimitado)
    
    -- Features
    features JSONB DEFAULT '[]',           -- [{name, included: true/false}]
    
    -- Integrations
    webhook_hotmart_url TEXT,
    webhook_kiwify_url TEXT,
    max_webhooks INTEGER DEFAULT 0,
    api_access BOOLEAN DEFAULT FALSE,
    white_label BOOLEAN DEFAULT FALSE,
    
    -- Controle
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,      -- "Mais Popular" badge
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. SUBSCRIPTIONS (Assinaturas)
-- Origem: admin/clientes, dashboard
-- ============================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    
    status subscription_status DEFAULT 'trial',
    plan_type plan_type DEFAULT 'mensal',
    monthly_value DECIMAL(10,2),
    
    -- Datas
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Payment gateway
    external_id TEXT,              -- ID do gateway (Hotmart, Kiwify, Stripe)
    gateway TEXT,                  -- "hotmart", "kiwify", "stripe"
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. AGENTS (Agentes de IA)
-- Origem: agentes (biblioteca), admin/agentes (CRUD)
-- ============================================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Info básica
    name TEXT NOT NULL,                     -- "Copywriter de Reels", "Script de WhatsApp"
    description TEXT,                       -- Descrição curta
    icon TEXT DEFAULT 'smart_toy',          -- Material icon name
    icon_gradient TEXT,                     -- "from-purple-500 to-indigo-600"
    avatar_url TEXT,
    
    -- Classificação
    category agent_category DEFAULT 'conteudo',
    status agent_status DEFAULT 'ativo',
    version TEXT DEFAULT '1.0',
    
    -- IA Config
    ai_provider TEXT,                       -- "openai", "anthropic", "google", "openrouter"
    ai_model TEXT,                          -- "gpt-4o", "claude-4.5-sonnet", etc.
    system_prompt TEXT,                     -- Prompt de sistema completo
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 4096,
    
    -- Acesso
    is_global BOOLEAN DEFAULT TRUE,         -- Disponível para todos os planos?
    required_plan_slug TEXT,                -- Plano mínimo necessário (NULL = free)
    is_locked BOOLEAN DEFAULT FALSE,        -- "EM BREVE"  
    
    -- Métricas
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    
    -- Controle
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_status ON agents(status);

CREATE TRIGGER agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. AGENT_FILES (Base de Conhecimento / RAG)
-- Origem: admin/agentes/novo (upload de PDFs, TXTs)
-- ============================================================
CREATE TABLE agent_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    
    file_name TEXT NOT NULL,               -- "manual-produto-v3.pdf"
    file_type TEXT,                         -- "PDF", "TXT", "DOCX"
    file_size TEXT,                         -- "2.4 MB"
    file_url TEXT,                          -- URL no Supabase Storage
    storage_path TEXT,                      -- Path no bucket
    
    -- Processamento
    is_processed BOOLEAN DEFAULT FALSE,
    chunks_count INTEGER DEFAULT 0,
    
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agent_files_agent_id ON agent_files(agent_id);

-- ============================================================
-- 6. CHAT_SESSIONS (Sessões de Chat)
-- Origem: chat
-- ============================================================
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    
    title TEXT,                             -- Título gerado automaticamente
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Métricas
    message_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    credits_consumed INTEGER DEFAULT 0,
    
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_agent_id ON chat_sessions(agent_id);

CREATE TRIGGER chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. CHAT_MESSAGES (Mensagens)
-- Origem: chat (Message interface)
-- ============================================================
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    
    role message_role NOT NULL,             -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    
    -- Metadata
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    model_used TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- ============================================================
-- 8. CALENDAR_EVENTS (Calendário Editorial)
-- Origem: calendario
-- ============================================================
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    
    -- Metadata
    platform TEXT,                          -- "instagram", "tiktok", "youtube", etc.
    content_type TEXT,                      -- "post", "story", "reel", "video"
    status event_status DEFAULT 'pendente',
    color TEXT,                             -- Cor hex para o calendário
    
    -- Vínculo
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    content_history_id UUID,               -- Referência ao conteúdo gerado
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);

CREATE TRIGGER calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 9. CONTENT_HISTORY (Histórico de Conteúdos)
-- Origem: historico
-- ============================================================
CREATE TABLE content_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT,                           -- Conteúdo gerado
    content_type TEXT,                      -- "copy", "script", "caption", etc.
    
    -- Origem
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    agent_name TEXT,                        -- Snapshot do nome do agente
    session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
    
    -- Metadata
    platform TEXT,
    word_count INTEGER DEFAULT 0,
    credits_used INTEGER DEFAULT 0,
    
    -- Status
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_history_user_id ON content_history(user_id);

CREATE TRIGGER content_history_updated_at
    BEFORE UPDATE ON content_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Adiciona FK circular do calendar_events
ALTER TABLE calendar_events 
    ADD CONSTRAINT fk_calendar_content_history
    FOREIGN KEY (content_history_id) REFERENCES content_history(id) ON DELETE SET NULL;

-- ============================================================
-- 10. COMMUNITY_POSTS (Comunidade)
-- Origem: comunidade
-- ============================================================
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    title TEXT,
    content TEXT NOT NULL,
    category TEXT,                          -- "dica", "duvida", "conquista", "recurso"
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    -- Media
    image_url TEXT,
    
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);

CREATE TRIGGER community_posts_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 11. VAULT_REFERENCES (Cofre de Referências)
-- Origem: cofre
-- ============================================================
CREATE TABLE vault_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    reference_type TEXT,                    -- "prompt", "link", "imagem", "arquivo", "template"
    
    -- Conteúdo
    content TEXT,                           -- Texto/prompt salvo
    url TEXT,                              -- Link externo
    file_url TEXT,                         -- Arquivo no storage
    thumbnail_url TEXT,
    
    -- Organização
    tags TEXT[],
    category TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vault_references_user_id ON vault_references(user_id);

CREATE TRIGGER vault_references_updated_at
    BEFORE UPDATE ON vault_references
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 12. MODULES (Módulos da Plataforma)
-- Origem: modulos
-- ============================================================
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name TEXT NOT NULL,                     -- "Central de IA", "Calendário", etc.
    description TEXT,
    icon TEXT,
    icon_gradient TEXT,
    
    -- Acesso
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    required_plan_slug TEXT,
    route TEXT,                             -- "/chat", "/calendario", etc.
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 13. NOTIFICATIONS (Notificações)
-- Origem: dashboard (ícone de sino)
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',              -- "info", "success", "warning", "error"
    
    -- Link
    action_url TEXT,
    action_label TEXT,
    
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── PLANS (público para leitura) ──
CREATE POLICY "Plans are viewable by everyone"
    ON plans FOR SELECT USING (true);
CREATE POLICY "Only admins can manage plans"
    ON plans FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ── SUBSCRIPTIONS ──
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage subscriptions"
    ON subscriptions FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ── AGENTS (público para leitura) ──
CREATE POLICY "Agents are viewable by authenticated users"
    ON agents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can manage agents"
    ON agents FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ── AGENT_FILES ──
CREATE POLICY "Agent files viewable by authenticated users"
    ON agent_files FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can manage agent files"
    ON agent_files FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ── CHAT_SESSIONS ──
CREATE POLICY "Users can view own chat sessions"
    ON chat_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own chat sessions"
    ON chat_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own chat sessions"
    ON chat_sessions FOR UPDATE USING (user_id = auth.uid());

-- ── CHAT_MESSAGES ──
CREATE POLICY "Users can view messages from own sessions"
    ON chat_messages FOR SELECT USING (
        EXISTS (SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can insert messages in own sessions"
    ON chat_messages FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid())
    );

-- ── CALENDAR_EVENTS ──
CREATE POLICY "Users can manage own events"
    ON calendar_events FOR ALL USING (user_id = auth.uid());

-- ── CONTENT_HISTORY ──
CREATE POLICY "Users can manage own content history"
    ON content_history FOR ALL USING (user_id = auth.uid());

-- ── COMMUNITY_POSTS (público para leitura entre autenticados) ──
CREATE POLICY "Authenticated users can view community posts"
    ON community_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create own posts"
    ON community_posts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own posts"
    ON community_posts FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own posts"
    ON community_posts FOR DELETE USING (user_id = auth.uid());

-- ── VAULT_REFERENCES ──
CREATE POLICY "Users can manage own vault references"
    ON vault_references FOR ALL USING (user_id = auth.uid());

-- ── MODULES (público para leitura) ──
CREATE POLICY "Modules are viewable by everyone"
    ON modules FOR SELECT USING (true);
CREATE POLICY "Only admins can manage modules"
    ON modules FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ── NOTIFICATIONS ──
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- SEED DATA: Planos iniciais
-- ============================================================
INSERT INTO plans (name, slug, tier, price_monthly, price_yearly, credits_quota, is_popular, features, sort_order) VALUES
(
    'Starter', 'starter', 'Iniciante',
    97.00, 997.00, 100000, FALSE,
    '[{"name": "Acesso ao Painel Básico", "included": true}, {"name": "Suporte via Email", "included": true}, {"name": "API Privada", "included": false}, {"name": "Webhooks Customizados", "included": false}]'::jsonb,
    1
),
(
    'Pro', 'pro', 'Profissional',
    197.00, 1997.00, 500000, TRUE,
    '[{"name": "Acesso ao Painel Completo", "included": true}, {"name": "Suporte Prioritário", "included": true}, {"name": "Acesso API (Restrito)", "included": true}, {"name": "5 Webhooks Ativos", "included": true}]'::jsonb,
    2
),
(
    'Enterprise', 'enterprise', 'Escalável',
    497.00, 4997.00, -1, FALSE,
    '[{"name": "White-label Customizado", "included": true}, {"name": "Gerente de Conta", "included": true}, {"name": "API Full Access", "included": true}, {"name": "Webhooks Ilimitados", "included": true}]'::jsonb,
    3
);

-- ============================================================
-- SEED DATA: Agentes iniciais
-- ============================================================
INSERT INTO agents (name, description, icon, icon_gradient, category, status, version) VALUES
('Copywriter de Reels', 'Criação de roteiros virais e legendas magnéticas otimizadas para retenção.', 'movie_edit', 'from-purple-500 to-indigo-600', 'copywriting', 'ativo', '1.0'),
('Script de WhatsApp', 'Sequências persuasivas para fechamento imediato e quebra de objeções.', 'chat_bubble', 'from-green-400 to-emerald-600', 'vendas', 'ativo', '1.0'),
('Analista de SEO', 'Otimização técnica e estratégica de palavras-chave para mecanismos de busca.', 'search', 'from-blue-400 to-cyan-600', 'estrategico', 'ativo', '1.0'),
('Gestor de E-mails', 'Organização e respostas inteligentes para seu inbox com priorização automática.', 'mail', 'from-amber-400 to-orange-600', 'produtividade', 'ativo', '1.0'),
('Designer de Prompts', 'Engenharia reversa de imagens e criação de comandos ultra-precisos.', 'brush', NULL, 'conteudo', 'em_breve', '2.0'),
('Tradutor Contextual', 'Tradução fluida com adaptação de gírias e contextos culturais regionais.', 'translate', NULL, 'conteudo', 'em_breve', '2.0'),
('Analista de Dados', 'Transforme planilhas complexas em insights acionáveis e visualizações.', 'monitoring', NULL, 'analytics', 'em_breve', '2.0'),
('Pesquisador Acadêmico', 'Sintetize papers e artigos científicos em resumos estruturados.', 'school', NULL, 'educacao', 'em_breve', '2.0');

-- ============================================================
-- FIM DA MIGRATION
-- ============================================================
