# Chave.AI — Estúdio Digital

Plataforma SaaS de IA para marketing digital. Agentes inteligentes, análise de vídeos virais, calendário de conteúdo e mais.

## Tecnologias

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **IA**: Google Gemini 2.0 Flash
- **Deploy**: Vercel

## Setup Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Copie .env.example para .env.local e preencha:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - GEMINI_API_KEY

# 3. Rodar
npm run dev
```

Acesse `http://localhost:3000`

## Estrutura do Projeto

```
src/
├── app/
│   ├── admin/          # Painel administrativo (protegido por AdminGuard)
│   │   ├── agentes/    # CRUD de agentes IA
│   │   ├── clientes/   # Gestão de clientes
│   │   ├── planos/     # Gestão de planos de assinatura
│   │   ├── integracoes/# Chaves de API (OpenAI, Anthropic, Gemini)
│   │   └── ...
│   ├── api/            # API Routes
│   │   ├── chat/       # Chat streaming com Gemini
│   │   ├── vault/      # Cofre (análise de vídeos virais)
│   │   ├── calendar/   # Calendário com geração IA
│   │   ├── planos/     # API pública de planos + subscribe
│   │   └── admin/      # APIs protegidas do admin
│   ├── agentes/        # Biblioteca de agentes (cliente)
│   ├── cofre/          # Cofre de referências virais
│   ├── calendario/     # Calendário de conteúdo
│   ├── historico/      # Histórico de conversas
│   ├── perfil/         # Perfil do usuário
│   ├── configuracoes/  # Configurações da conta
│   ├── planos/         # Página de pricing (cliente)
│   └── chat/           # Chat com agentes IA
├── components/         # Componentes reutilizáveis
├── contexts/           # AuthContext (auth + profile)
├── lib/                # Supabase client, admin auth
└── middleware.ts        # Proteção de rotas autenticadas
scripts/
├── seed-agents.mjs     # Seed de agentes iniciais
├── check-schema.mjs    # Verificação de schema do banco
└── check-vault.mjs     # Verificação do vault
supabase/
└── migrations/         # SQL migrations
```

## Documentação

- **[DECISOES_PENDENTES.md](./DECISOES_PENDENTES.md)** — Itens que precisam de decisão/implementação para produção

## Environment Variables

| Variável | Obrigatório | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Chave anônima do Supabase |
| `GEMINI_API_KEY` | ✅ | Chave da API Google Gemini |
| `COBALT_API_URL` | ⬜ | URL da instância Cobalt (para Cofre completo) |
