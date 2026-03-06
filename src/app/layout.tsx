import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
    title: "Escritório Digital — O Coração da IA",
    description: "Transforme conteúdos virais em roteiros únicos, humanizados e prontos para converter.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark">
            <head>
                {/* Fontes do Stitch (Google Fonts) */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Sora:wght@100..800&family=Instrument+Serif:ital@0;1&family=Fira+Code:wght@400;500&display=swap"
                    rel="stylesheet"
                />
                {/* Material Symbols Outlined (ícones do Stitch) */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
                    rel="stylesheet"
                />
            </head>
            <body className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden">
                <AuthProvider>
                    <div className="noise-overlay"></div>
                    <Topbar />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
