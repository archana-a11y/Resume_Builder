"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Trash2, Edit3, LogOut, Loader2, User, LayoutDashboard, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TrackerBoard from "@/components/TrackerBoard";

interface Resume {
    id: string;
    title: string;
    updated_at: string;
}

export default function DashboardPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"resumes" | "applications">("resumes");

    useEffect(() => {
        const fetchUserAndResumes = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data, error } = await supabase
                .from("resumes")
                .select("id, title, updated_at")
                .order("updated_at", { ascending: false });

            if (!error) {
                setResumes(data || []);
            }
            setLoading(false);
        };

        fetchUserAndResumes();
    }, [router]);

    const handleCreateResume = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("resumes")
            .insert([{ user_id: user.id, title: "Untitled Resume", content: {} }])
            .select()
            .single();

        if (!error && data) {
            router.push(`/editor/${data.id}`);
        }
    };

    const handleDeleteResume = async (id: string) => {
        const { error } = await supabase.from("resumes").delete().eq("id", id);
        if (!error) {
            setResumes(resumes.filter((r) => r.id !== id));
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-12">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg shadow-purple-500/20">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Dashboard</h1>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium ml-12">Welcome back, {user?.email.split('@')[0]}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setActiveTab("resumes")}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'resumes' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Resumes
                            </button>
                            <button
                                onClick={() => setActiveTab("applications")}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Tracker
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 glass p-2 rounded-2xl border border-white/5">
                            <div className="flex items-center space-x-2 px-4 text-zinc-400">
                                <User className="w-4 h-4" />
                                <span className="text-xs font-bold truncate max-w-[150px]">{user?.email}</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.header>

                <AnimatePresence mode="wait">
                    {activeTab === "resumes" ? (
                        <motion.div
                            key="resumes"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateResume}
                                className="flex flex-col items-center justify-center p-8 h-72 rounded-[40px] border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-5 bg-zinc-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-xl">
                                    <Plus className="w-10 h-10 text-zinc-500 group-hover:text-purple-400" />
                                </div>
                                <span className="text-zinc-400 font-black uppercase tracking-widest text-xs group-hover:text-white transition-colors">Create New</span>
                            </motion.button>

                            {resumes.map((resume, index) => (
                                <motion.div
                                    key={resume.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="glass-card group relative flex flex-col p-8 h-72 rounded-[40px]"
                                >
                                    {/* Existing Card Content */}
                                    <div className="flex-1">
                                        <div className="p-4 bg-white/5 w-fit rounded-[20px] mb-6 text-zinc-500 group-hover:text-purple-400 group-hover:scale-110 transition-all shadow-lg border border-white/5">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-black truncate group-hover:text-white transition-colors leading-tight">
                                            {resume.title}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                                Last active {new Date(resume.updated_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                href={`/editor/${resume.id}`}
                                                className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all group/link"
                                            >
                                                <Edit3 className="w-4 h-4 group-hover/link:rotate-12 transition-transform" />
                                                <span>Edit</span>
                                            </Link>
                                            <Link
                                                href={`/cover-letter/${resume.id}`}
                                                className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-all group/link"
                                            >
                                                <Sparkles className="w-4 h-4 group-hover/link:rotate-12 transition-transform" />
                                                <span>Letter</span>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteResume(resume.id)}
                                            className="p-3 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="tracker"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <TrackerBoard />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
