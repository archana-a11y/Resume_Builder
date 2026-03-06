"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    ChevronLeft,
    Loader2,
    Sparkles,
    MessageSquare,
    Target,
    Zap,
    CheckCircle2,
    Trophy,
    Lightbulb,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPrepPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [application, setApplication] = useState<any>(null);
    const [prepData, setPrepData] = useState<any>(null);
    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from("applications")
            .select("*, resumes(*)")
            .eq("id", id)
            .single();

        if (error) {
            router.push("/dashboard");
            return;
        }

        setApplication(data);
        if (data.notes) {
            try {
                const savedPrep = JSON.parse(data.notes);
                if (savedPrep.questions) setPrepData(savedPrep);
            } catch (e) {
                // Not valid JSON prep data, just normal notes
            }
        }
        setLoading(false);
    };

    const generatePrep = async () => {
        setGenerating(true);
        try {
            const response = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData: application.resumes.content,
                    jobDescription: application.role_title + " at " + application.company_name, // Should ideally have a JD field, using title for now
                    companyName: application.company_name,
                    roleTitle: application.role_title
                }),
            });

            const data = await response.json();
            setPrepData(data);

            // Save to application notes as JSON
            await supabase
                .from("applications")
                .update({ notes: JSON.stringify(data) })
                .eq("id", id);

        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Board</span>
                    </button>
                    <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Trophy className="w-5 h-5 text-emerald-400" />
                    </div>
                </header>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-4xl font-black tracking-tight uppercase">Interview Coach</h1>
                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Powered</div>
                    </div>
                    <p className="text-zinc-500 text-lg">
                        Preparing for <span className="text-white font-bold">{application.role_title}</span> at <span className="text-white font-bold">{application.company_name}</span>
                    </p>
                </div>

                {!prepData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-12 rounded-[40px] border border-white/5 text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
                            <Sparkles className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase">Start Your Prep</h2>
                            <p className="text-zinc-500 max-w-md mx-auto">
                                Our AI will analyze your resume and the job role to generate 6 custom interview questions and coaching guides.
                            </p>
                        </div>
                        <button
                            onClick={generatePrep}
                            disabled={generating}
                            className="px-10 py-5 bg-white text-black rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 flex items-center space-x-3 mx-auto disabled:opacity-50"
                        >
                            {generating ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /><span>Consulting Coach...</span></>
                            ) : (
                                <><Zap className="w-5 h-5" /><span>Generate Interview Guide</span></>
                            )}
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Questions List */}
                        <div className="lg:col-span-5 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-4 mb-6">Target Questions</h3>
                            {prepData.questions.map((q: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveQuestion(idx)}
                                    className={`w-full text-left p-6 rounded-[32px] border transition-all space-y-2 group ${activeQuestion === idx
                                            ? 'bg-white/10 border-white/20 shadow-xl'
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${q.type === 'Technical' ? 'text-blue-400' :
                                                q.type === 'Behavioral' ? 'text-purple-400' : 'text-amber-400'
                                            }`}>
                                            {q.type}
                                        </span>
                                        {activeQuestion === idx && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                                    </div>
                                    <p className={`text-sm font-bold leading-relaxed transition-colors ${activeQuestion === idx ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                        {q.question}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Prep Detail */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeQuestion}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="glass p-8 rounded-[40px] border border-white/10 space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 text-white/5 -z-10">
                                            <MessageSquare className="w-32 h-32" />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 text-emerald-400">
                                                <Lightbulb className="w-5 h-5" />
                                                <span className="text-xs font-black uppercase tracking-widest">Coaching Tip</span>
                                            </div>
                                            <p className="text-zinc-300 italic text-lg leading-relaxed">
                                                "{prepData.questions[activeQuestion].coaching}"
                                            </p>
                                        </div>

                                        <div className="space-y-6 pt-6 border-t border-white/5">
                                            <div className="flex items-center space-x-3 text-white">
                                                <Target className="w-5 h-5" />
                                                <span className="text-xs font-black uppercase tracking-widest">STAR Method Strategy</span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {['Situation', 'Task', 'Action', 'Result'].map((step) => (
                                                    <div key={step} className="flex gap-4 group">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                                {step[0]}
                                                            </div>
                                                            <div className="w-[1px] h-full bg-white/5 mt-2" />
                                                        </div>
                                                        <div className="pb-6">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 group-hover:text-emerald-400 transition-colors">{step}</h4>
                                                            <p className="text-sm text-zinc-400 leading-relaxed">
                                                                {prepData.questions[activeQuestion].star_outline[step.toLowerCase()]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center px-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                            Question {activeQuestion + 1} of {prepData.questions.length}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setActiveQuestion(prev => Math.max(0, prev - 1))}
                                                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setActiveQuestion(prev => Math.min(prepData.questions.length - 1, prev + 1))}
                                                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
