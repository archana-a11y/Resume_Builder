import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Layout } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 z-0" />

            <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-4xl">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 animate-pulse transition-all hover:bg-purple-500/20 cursor-default">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">AI-Powered Resume Generation</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                    AI Resume <br />
                    <span className="text-purple-500 italic">Redefined</span>
                </h1>

                <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                    Create a professional, high-converting resume in minutes with our advanced AI.
                    Tailored to your industry, optimized for ATS, and designed to land your dream job.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        href="/login"
                        className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/templates"
                        className="px-8 py-4 bg-zinc-900 text-white font-semibold rounded-xl border border-zinc-800 transition-all hover:bg-zinc-800 flex items-center"
                    >
                        Browse Templates
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 w-full">
                    <FeatureCard
                        icon={<FileText className="w-6 h-6 text-purple-400" />}
                        title="Smart Generation"
                        description="AI analyzes your experience and crafts the perfect professional summary."
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-6 h-6 text-blue-400" />}
                        title="ATS Optimization"
                        description="Ensure your resume passes through applicant tracking systems every time."
                    />
                    <FeatureCard
                        icon={<Layout className="w-6 h-6 text-emerald-400" />}
                        title="Premium Layouts"
                        description="Choose from a curated collection of designer templates that stand out."
                    />
                </div>
            </div>
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:-translate-y-1">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
