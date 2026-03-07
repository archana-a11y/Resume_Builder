"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    ChevronLeft,
    Loader2,
    Download,
    Sparkles,
    FileText,
    Copy,
    Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CoverLetterPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeData, setResumeData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchResume = async () => {
            const { data, error } = await supabase
                .from("resumes")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                router.push("/dashboard");
                return;
            }

            setResumeData(data);
            setLoading(false);
        };

        fetchResume();
    }, [id, router]);

    const handleGenerate = async () => {
        if (!jobDescription) return;
        setGenerating(true);
        setStatus("AI is writing...");

        try {
            const res = await fetch('/api/cover-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeData: resumeData.content,
                    jobDescription
                })
            });
            const data = await res.json();

            if (data.content) {
                setCoverLetter(data.content);
                setStatus("Generated!");
            }
        } catch (e) {
            console.error(e);
            setStatus("Error!");
        }
        setGenerating(false);
        setTimeout(() => setStatus(""), 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
            {/* Input Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12 border-r border-white/5 overflow-y-auto no-print">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <header className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-2xl font-black uppercase tracking-tight">Cover Letter</h1>
                        </div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{status}</span>
                    </header>

                    <div className="glass-card p-8 rounded-[32px] space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-purple-400 mb-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Target Job</span>
                            </div>
                            <h2 className="text-xl font-bold">What role are you applying for?</h2>
                            <p className="text-zinc-500 text-sm">Paste the job description or a brief summary of the role here.</p>
                        </div>

                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="e.g. Senior Frontend Engineer at Vercel. Requirements: React, Next.js, Tailwind..."
                            rows={10}
                            className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                        />

                        <button
                            onClick={handleGenerate}
                            disabled={!jobDescription || generating}
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                        >
                            {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            <span>Generate Tailored Letter</span>
                        </button>
                    </div>

                    <div className="p-6 bg-zinc-900/30 rounded-2xl border border-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-zinc-400">Context used from your resume:</h3>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.content.skills?.slice(0, 8).map((skill: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400">{skill}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Preview Panel */}
            <div className="w-full md:w-1/2 bg-zinc-950 flex flex-col items-center justify-start p-8 md:p-12 overflow-y-auto min-h-screen">
                <AnimatePresence mode="wait">
                    {coverLetter ? (
                        <motion.div
                            key="letter"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-[21cm] space-y-6"
                        >
                            <div className="flex justify-end space-x-3 no-print mb-4">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 text-zinc-400 border border-white/10 rounded-xl text-xs font-bold hover:text-white transition-all"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? "Copied" : "Copy Text"}</span>
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center space-x-2 px-6 py-2 bg-white text-black rounded-xl text-xs font-black hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export PDF</span>
                                </button>
                            </div>

                            <article id="cover-letter-preview" className="w-full bg-white text-black p-[2cm] shadow-2xl min-h-[29.7cm] flex flex-col font-serif leading-relaxed text-sm">
                                <header className="mb-12 border-b-2 border-zinc-100 pb-8">
                                    <h2 className="text-3xl font-bold uppercase tracking-tight font-sans mb-4">
                                        {resumeData.content.personalInfo?.fullName}
                                    </h2>
                                    <div className="flex flex-wrap gap-x-6 text-xs text-zinc-400 font-sans font-medium">
                                        <span>{resumeData.content.personalInfo?.email}</span>
                                        <span>{resumeData.content.personalInfo?.phone}</span>
                                        <span>{resumeData.content.personalInfo?.location}</span>
                                    </div>
                                </header>

                                <div className="whitespace-pre-wrap flex-1">
                                    {coverLetter}
                                </div>

                                <footer className="mt-12 pt-8 border-t border-zinc-50 text-[10px] text-zinc-400 font-sans text-center italic">
                                    Tailored by AI Resume Engine
                                </footer>
                            </article>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-sm mt-32"
                        >
                            <div className="p-6 bg-zinc-900 rounded-full border border-white/5">
                                <Sparkles className="w-12 h-12 text-zinc-700" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Your Letter Awaits</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    Fill in the job description and click generate. Our AI will craft a personalized cover letter using your resume as a foundation.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
