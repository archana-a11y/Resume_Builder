"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Layout, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-black text-white overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
            </div>

            <div className="z-10 flex flex-col items-center text-center space-y-12 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 backdrop-blur-sm cursor-default"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold tracking-wide uppercase">AI-Powered Resume Engine</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h1 className="text-6xl md:text-9xl font-black tracking-tight leading-[0.9] text-gradient">
                        RESUME <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 italic">EVOLVED</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Stand out from the crowd with designer templates and AI-crafted content that resonates with recruiters and beats ATS systems.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 pt-4"
                >
                    <Link
                        href="/login"
                        className="group relative px-10 py-5 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] flex items-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center">
                            Start Building Now
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link
                        href="/templates"
                        className="px-10 py-5 bg-zinc-900/50 backdrop-blur-md text-white font-bold rounded-2xl border border-white/10 transition-all hover:bg-zinc-800 hover:border-white/20 flex items-center"
                    >
                        View Templates
                    </Link>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-24 w-full"
                >
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-yellow-400" />}
                        title="Instant Generation"
                        description="Paste your bio and watch our AI professionally structure your entire career history in seconds."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-blue-400" />}
                        title="Recruiter Approved"
                        description="Our templates are designed based on industry standards to ensure maximum readability for humans and AI."
                    />
                    <FeatureCard
                        icon={<Layout className="w-6 h-6 text-purple-400" />}
                        title="Studio Templates"
                        description="Access exclusive, high-end designs previously only available to executive coaching clients."
                    />
                </motion.div>
            </div>
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-8 rounded-3xl text-left space-y-4"
        >
            <div className="p-3 bg-white/5 w-fit rounded-2xl border border-white/10">{icon}</div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
        </motion.div>
    );
}
