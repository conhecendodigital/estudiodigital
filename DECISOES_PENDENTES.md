# Decisões Pendentes — Chave.AI

> **Status**: ⏳ Aguardando decisão da gestão  
> **Data**: 2026-03-06  

---

## 1. Cofre — API de Download de Vídeos

### Situação Atual

O **Cofre (Raio-X Viral)** analisa vídeos curtos com IA (Gemini 2.0 Flash):

| Plataforma | Análise IA | Status | Motivo |
|---|---|---|---|
| **YouTube Shorts** | ✅ Completa | Funcionando | Gemini acessa URLs do YouTube nativamente |
| **Instagram Reels** | ❌ Referência visual | Bloqueado | Instagram bloqueia download de vídeos |
| **TikTok** | ❌ Referência visual | Bloqueado | TikTok bloqueia download de vídeos |

### Problema

Gemini precisa receber o conteúdo do vídeo. Instagram/TikTok bloqueiam acesso direto.

### Opções

| Serviço | Preço | Compatível com Vercel? | Prós | Contras |
|---|---|---|---|---|
| **Cobalt (self-hosted)** | ~R$25/mês (Railway) | ✅ Sim (HTTP API) | Recomendado, open-source, TikTok+IG+YT | Precisa hospedar container Docker separado |
| **yt-dlp (binário)** | Grátis | ❌ Só VPS/Docker | 100% grátis, mais completo | Não roda na Vercel (serverless) |
| **RapidAPI (TikTok/IG)** | ~$10-30/mês | ✅ Sim (HTTP API) | Fácil integração | Custo recorrente, limites |

### Recomendação: Cobalt

Como o app será hospedado na **Vercel**, a melhor opção é o **Cobalt** (open-source):

1. Deploy o Cobalt no **Railway** ($5/mês) ou **Render** (free tier): `docker pull ghcr.io/imputnet/cobalt:latest`
2. Configure a env var `COBALT_API_URL` no Vercel apontando para sua instância
3. O código do Cofre (`vault/process/route.ts`) já tem um **plug point** pronto na função `downloadVideo()` — adicione a chamada HTTP ao Cobalt ali

### Como integrar (código)

No arquivo `src/app/api/vault/process/route.ts`, linha ~88, substituir o plug point:

```typescript
// Dentro de downloadVideo(), antes do fallback:
const cobaltUrl = process.env.COBALT_API_URL;
if (cobaltUrl) {
    const res = await fetch(`${cobaltUrl}/api/json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url, vCodec: 'h264', vQuality: '720' }),
    });
    const data = await res.json();
    if (data.url) {
        const videoRes = await fetch(data.url);
        return { buffer: Buffer.from(await videoRes.arrayBuffer()), mimeType: 'video/mp4' };
    }
}
```

**Esforço**: 2-3 horas (deploy Cobalt + integrar código).

**Sem esta API**: Instagram/TikTok ficam como referência visual (só thumbnail + link).

---

## 2. Gateway de Pagamento

### Situação Atual

O app tem sistema de **planos e assinaturas** no banco de dados, mas **não processa pagamentos reais**. Precisa de um gateway para cobrar dos clientes.

### Opções

| Gateway | Preço (por transação) | Pix | Boleto | Cartão | Recorrência | Prós |
|---|---|---|---|---|---|---|
| **Stripe** | 3.99% + R$0.39 | ✅ | ❌ | ✅ | ✅ | Padrão mundial, excelente API, dashboard |
| **Mercado Pago** | 3.99% + R$0.39 | ✅ | ✅ | ✅ | ✅ | Brasileiro, mais familiar para clientes BR |
| **Asaas** | 2.99% por transação | ✅ | ✅ | ✅ | ✅ | Focado em recorrência, menor taxa |

### O que será implementado

1. Checkout na página de planos (cartão/Pix)
2. Webhooks para atualizar status da assinatura automaticamente
3. Portal do cliente para gerenciar pagamento
4. Renovação automática de créditos no pagamento mensal

**Esforço**: 6-10 horas de implementação total.

---

## 3. RAG — Knowledge Base dos Agentes

### Situação Atual

Os agentes já aceitam **upload de arquivos** (PDF, DOCX, TXT) que ficam salvos no Supabase Storage. Porém, o agente **não usa esses arquivos** ao responder no chat.

### O que falta

Implementar **RAG (Retrieval Augmented Generation)**:
1. Extrair texto dos arquivos enviados
2. Criar embeddings (vetores) do conteúdo
3. No chat, buscar trechos relevantes e enviar junto com a pergunta do usuário

### Opções

| Solução | Custo | Prós | Contras |
|---|---|---|---|
| **Supabase pgvector** | Gratuito (já incluso) | Sem custo extra, mesmo banco | Limitado a ~10k documentos no plano free |
| **Pinecone** | Free tier (até 100k vetores) | Especializado, rápido | Serviço externo, complexidade |
| **Gemini Embeddings** | Gratuito (API Gemini) | Sem custo, já usamos Gemini | Precisa de armazenamento para vetores |

**Recomendação**: Supabase pgvector + Gemini Embeddings = **custo zero**, usando serviços que já temos.

**Esforço**: 4-6 horas para implementação completa.

---

## 4. Features dos Planos — Controle de Acesso Real

### O que já está pronto

O admin **já configura tudo** pelo painel (`/admin/planos`):

| Campo | Funciona? | Descrição |
|---|---|---|
| Nome do plano | ✅ | Ex: "Starter", "Pro", "Enterprise" |
| Preço mensal/anual | ✅ | Ex: R$ 97/mês ou R$ 970/ano |
| Créditos por mês | ✅ | Ex: 100.000 ou ilimitado (-1) |
| Features (lista) | ✅ | Ex: "Acesso ao Painel Completo", "API Privada" |
| Popular / Ativo | ✅ | Badge "Mais Popular", toggle ativar/desativar |
| Assinar / Upgrade / Cancelar | ✅ | Página `/planos` para o cliente, APIs prontas |

### O que falta implementar (para o chefe)

As features listadas nos planos são **apenas visuais** — aparecem na tela mas o app não bloqueia/libera funcionalidades com base nelas. Exemplos do que precisa ser implementado:

| Feature | Como implementar |
|---|---|
| **Limite de agentes** | Verificar `plan.max_agents` ao criar nova conversa |
| **Limite de webhooks** | Campo `max_webhooks` já existe na tabela `plans` — validar no admin |
| **API Access** | Campo `api_access` já existe — criar middleware para rotas de API externa |
| **White-label** | Campo `white_label` já existe — remover branding "chave.ai" se ativo |
| **Suporte prioritário** | Implementar sistema de tickets com prioridade por plano |

### Como funciona hoje (fluxo completo)

```
Admin cria plano (/admin/planos)
    → Define nome, preço, créditos, features
    → Plano aparece ativo em /planos

Cliente acessa /planos
    → Vê grid de pricing com toggle mensal/anual
    → Clica "Assinar Agora" ou "Fazer Upgrade"
    → API cria/atualiza subscription no Supabase
    → Créditos do perfil são atualizados automaticamente
    → Role do perfil muda (cliente → premium)

Cliente cancela
    → Modal de confirmação
    → Status → "cancelado"
    → Créditos resetados para 2.000 (gratuito)
```

### O que o chefe precisa fazer

1. **Escolher gateway de pagamento** (ver Seção 2) e integrar checkout real no fluxo de subscribe
2. **Implementar feature gating** — verificar no código quais funcionalidades cada plano libera
3. **Webhook de pagamento** — atualizar status da subscription automaticamente quando pagamento é aprovado/falha

**Esforço**: Feature gating = 4-6 horas | Gateway completo = 6-10 horas

---

## 5. Configuração de API Keys e Ambiente de Produção

### Variáveis de Ambiente (`.env.local` / Vercel)

O app precisa destas variáveis configuradas para funcionar:

| Variável | Obrigatório? | Onde conseguir | Usado em |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | Supabase → Settings → API | Auth, Database, Storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Supabase → Settings → API | Auth, Database, Storage |
| `GEMINI_API_KEY` | ✅ Sim | Google AI Studio | Chat, Cofre, Calendário IA |
| `COBALT_API_URL` | ⬜ Opcional | Self-host Cobalt | Cofre (TikTok/IG) |

### Chaves de IA no Painel Admin

Além do `.env.local`, o admin pode configurar chaves de provedores de IA pelo painel (`/admin/integracoes`):

| Provider | Modelo | Status |
|---|---|---|
| **Google (Gemini)** | Gemini 2.0 Flash | ✅ Usado atualmente em todo o app |
| **OpenAI** | GPT-4 Turbo | ⬜ Preparado — o admin pode adicionar a chave pelo painel |
| **Anthropic** | Claude 3.5 Sonnet | ⬜ Preparado — o admin pode adicionar a chave pelo painel |
| **Geração de Imagem** | DALL·E 3 | ⬜ Preparado — o admin pode adicionar a chave pelo painel |

> [!NOTE]
> Atualmente o app usa **apenas o Gemini** (variável `GEMINI_API_KEY`). As chaves de OpenAI/Anthropic ficam salvas no banco via `/admin/integracoes`, mas o código dos agentes ainda não alterna entre provedores automaticamente. Para suportar múltiplos provedores, implementar um seletor de modelo na criação do agente.

### Deploy na Vercel — Checklist

1. Criar projeto na Vercel apontando para o repositório GitHub
2. Configurar **Environment Variables** no dashboard da Vercel (todas da tabela acima)
3. Ativar o bucket `avatars` e `vault_videos` no Supabase Storage como **público**
4. Verificar RLS policies nas tabelas do Supabase
5. Testar login, chat e Cofre em produção

---

## Resumo Executivo

| Decisão | Impacto | Custo Mensal | Prioridade |
|---|---|---|---|
| API de download (Cofre/Cobalt) | IG + TikTok completos | ~R$25 (Railway) | Média |
| Gateway de pagamento | Receita real | % por transação | **Alta** |
| RAG (Knowledge Base) | Agentes mais inteligentes | R$0 (recomendado) | Média |
| Feature gating (Planos) | Planos com controle real | R$0 | **Alta** |
| Configurar env vars no Vercel | App funcionar em prod | R$0 | **Alta** |

> [!IMPORTANT]
> O **gateway de pagamento**, **feature gating** e **configuração de env vars na Vercel** são as decisões/ações mais críticas para colocar o app em produção.
