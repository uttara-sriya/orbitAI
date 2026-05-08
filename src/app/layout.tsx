import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "OrbitAI | Precision Travel Planning & Experience Engine",
    description: "Next-gen travel itinerary, flight and stay recommendations powered by AI and real-time mapping.",
    keywords: ["travel", "AI", "itinerary", "flights", "hotels", "budget travel"],
    openGraph: {
        title: "OrbitAI | Travel Assistant",
        description: "Intelligent travel planning with budget-aware recommendations.",
        url: "https://orbit-ai-travel.vercel.app",
        siteName: "OrbitAI",
        images: [{ url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828", width: 1200, height: 630 }],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "OrbitAI | Precision Travel Planning",
        description: "Intelligent travel planning with budget-aware recommendations.",
        images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased selection:bg-primary/30`}>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary text-white px-4 py-2 rounded-lg shadow-xl"
                >
                    Skip to content
                </a>
                {children}
            </body>
        </html>
    );
}
