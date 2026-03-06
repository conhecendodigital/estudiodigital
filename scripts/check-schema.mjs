import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
    const data = await res.json();

    const vaultDef = data.definitions?.vault_references;
    if (vaultDef) {
        console.log("SCHEMA:", vaultDef.properties);
    }
}
check();
