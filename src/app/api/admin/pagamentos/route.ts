import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// Gateway Visual & Structural Dictionary
const GATEWAY_DICTIONARY = [
    {
        id: 'mercadopago',
        name: 'Mercado Pago',
        description: 'Receba por Pix, boleto e cartão de crédito com a maior plataforma de pagamento da América Latina.',
        icon: 'account_balance_wallet',
        accentColor: 'text-sky-400',
        accentBg: 'bg-sky-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]',
        fields: [
            { key: 'publicKey', label: 'Public Key', placeholder: 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
            { key: 'accessToken', label: 'Access Token', placeholder: 'APP_USR-0000000000000000-000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-000000000' },
        ],
        webhookUrl: 'https://api.estudiodigital.com/webhooks/mercadopago',
    },
    {
        id: 'stripe',
        name: 'Stripe',
        description: 'Pagamentos globais com cartão de crédito, Apple Pay e Google Pay. Ideal para planos internacionais.',
        icon: 'credit_card',
        accentColor: 'text-violet-400',
        accentBg: 'bg-violet-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
        fields: [
            { key: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_test_sua_chave_publica_aqui' },
            { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_test_sua_chave_secreta_aqui' },
            { key: 'webhookSecret', label: 'Webhook Secret (Signing Secret)', placeholder: 'whsec_sua_assinatura_webhook_aqui' },
        ],
        webhookUrl: 'https://api.estudiodigital.com/webhooks/stripe',
    },
    {
        id: 'hotmart',
        name: 'Hotmart',
        description: 'Venda seus produtos digitais e gerencie afiliados.',
        icon: 'local_fire_department',
        accentColor: 'text-orange-400',
        accentBg: 'bg-orange-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
        fields: [
            { key: 'hottok', label: 'Hottok (Token de Integração)', placeholder: 'seu_token_hottok_aqui' },
            { key: 'clientId', label: 'Client ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
            { key: 'clientSecret', label: 'Client Secret', placeholder: 'seu_client_secret_aqui' }
        ],
        webhookUrl: 'https://api.estudiodigital.com/webhooks/hotmart',
    },
    {
        id: 'kiwify',
        name: 'Kiwify',
        description: 'Plataforma focada em infoprodutos com alta conversão e checkout transparente.',
        icon: 'bolt',
        accentColor: 'text-green-400',
        accentBg: 'bg-green-500/15',
        accentGlow: 'shadow-[0_0_20px_rgba(74,222,128,0.15)]',
        fields: [
            { key: 'webhookToken', label: 'Webhook Token', placeholder: 'seu_token_webhook_kiwify' },
            { key: 'accountId', label: 'Account ID', placeholder: 'id_da_sua_conta' }
        ],
        webhookUrl: 'https://api.estudiodigital.com/webhooks/kiwify',
    }
];

// GET /api/admin/pagamentos — Buscar config gateways
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const { data, error } = await supabase
        .from('gateway_settings')
        .select('*')
        .order('created_at');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Combine Dictionary + DB State
    const combinedGateways = GATEWAY_DICTIONARY.map(baseConfig => {
        // Encontrar no DB (nota: a tabela chama a coluna the identifier de 'gateway')
        const dbState = data?.find(gw => gw.gateway === baseConfig.id);

        const maskedCreds: Record<string, string> = {};
        let isEnabled = false;

        if (dbState) {
            isEnabled = dbState.is_enabled;
            if (dbState.credentials && typeof dbState.credentials === 'object') {
                for (const [key, val] of Object.entries(dbState.credentials as Record<string, string>)) {
                    maskedCreds[key] = val ? String(val) : '';
                }
            }
        }

        return {
            ...baseConfig,
            is_enabled: isEnabled,
            credentials: maskedCreds,
            credentials_set: dbState && dbState.credentials && Object.values(dbState.credentials as Record<string, string>).some((v) => !!v),
        };
    });

    return NextResponse.json({ gateways: combinedGateways });
}

// PUT /api/admin/pagamentos — Salvar config gateways
export async function PUT(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;
    const { supabase } = auth as { supabase: Awaited<ReturnType<typeof import('@/lib/supabase-server').createClient>> };

    const body = await request.json();
    // note: the frontend was passing `is_active`, but table uses `is_enabled`
    const { provider, credentials, is_active, webhook_url } = body;

    if (!provider) {
        return NextResponse.json({ error: 'Provedor (gateway) é obrigatório' }, { status: 400 });
    }

    // Retrieve name from dictionary
    const dictConfig = GATEWAY_DICTIONARY.find(g => g.id === provider);

    const updateData: Record<string, unknown> = {
        gateway: provider,
        display_name: dictConfig?.name || provider,
        updated_at: new Date().toISOString()
    };

    // We only update what was provided in the request
    if (credentials !== undefined) updateData.credentials = credentials;
    if (is_active !== undefined) updateData.is_enabled = is_active;
    if (webhook_url !== undefined) updateData.webhook_url = webhook_url;

    // Use Upsert since the row might not exist in the DB yet, matching by gateway
    const { data, error } = await supabase
        .from('gateway_settings')
        .upsert(updateData, { onConflict: 'gateway' })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ gateway: data });
}

// POST /api/admin/pagamentos — Testar gateway
export async function POST(request: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth && auth.error) return auth.error;

    const body = await request.json();
    const { provider } = body;

    // Gateway testing é pendente — depende da integração real com cada provider
    // Por agora, retorna sucesso simulado se gateway configurado
    return NextResponse.json({
        success: true,
        message: `Teste de conexão com ${provider} — integração pendente de implementação.`,
    });
}
