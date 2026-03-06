import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/app/globals.css";


// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Resume Builder",
    description: "Build a premium, AI-powered resume in minutes.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            </head>
            <body className="font-sans">{children}</body>
        </html >
    );
}
