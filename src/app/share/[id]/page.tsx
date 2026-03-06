"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicResumePage() {
    const { id } = useParams();
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndTrack = async () => {
            // Track view
            if (id) {
                // We use a direct update for simplicity, but an RPC incrementing by 1 is safer.
                // Since this is a simple tracker, we'll fetch first then increment.
                const { data: current } = await supabase
                    .from("resumes")
                    .select("views")
                    .eq("id", id)
                    .single();

                if (current) {
                    await supabase
                        .from("resumes")
                        .update({ views: (current.views || 0) + 1 })
                        .eq("id", id);
                }
            }

            const { data, error } = await supabase
                .from("resumes")
                .select("*")
                .eq("id", id)
                .eq("is_public", true)
                .single();

            if (!error && data) {
                setResume(data);
            }
            setLoading(false);
        };

        fetchAndTrack();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-black text-white space-y-6">
                <div className="p-6 bg-red-500/10 rounded-full">
                    <ShieldCheck className="w-16 h-16 text-red-400" />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black uppercase">Resume Not Found</h1>
                    <p className="text-zinc-500 max-w-sm">This resume is either private or does not exist.</p>
                </div>
            </div>
        );
    }

    const { content } = resume;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-24 relative overflow-hidden">
            {/* Aesthetics */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto space-y-16">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/10">
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-black tracking-tighter uppercase leading-none"
                        >
                            {content.personalInfo?.fullName || "Professional"}
                        </motion.h1>
                        <div className="flex items-center space-x-4 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                            <span>{content.personalInfo?.email}</span>
                            <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                            <span>{content.personalInfo?.location}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center space-x-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download PDF</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    <div className="md:col-span-8 space-y-16">
                        <section className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">Professional Experience</h2>
                            <div className="space-y-12">
                                {content.experience?.map((exp: any, idx: number) => (
                                    <div key={idx} className="space-y-4 relative pl-8 border-l border-white/5">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                            <div className="flex items-center space-x-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                                <span>{exp.company}</span>
                                                <span>•</span>
                                                <span>{exp.period}</span>
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">Education</h2>
                            <div className="space-y-8">
                                {content.education?.map((edu: any, idx: number) => (
                                    <div key={idx} className="space-y-2 pl-8 border-l border-white/5 relative">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-zinc-700 rounded-full" />
                                        <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{edu.school} • {edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-4 space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400">Core Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {content.skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="glass p-8 rounded-[32px] border border-white/5 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Portfolio Link
                            </h3>
                            <p className="text-zinc-500 text-[10px] leading-relaxed font-medium">
                                This profile is generated via AI Resume Builder. Verified professional data.
                            </p>
                        </section>
                    </div>
                </div>

                <footer className="pt-24 pb-12 text-center border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">
                        Generated by AI Resume Builder • 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
