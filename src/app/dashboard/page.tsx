"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Trash2, Edit3, LogOut, Loader2, User } from "lucide-react";

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
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Your Resumes</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-zinc-400">
                            <User className="w-4 h-4" />
                            <span className="text-sm border-r border-zinc-800 pr-6">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center text-zinc-400 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <button
                        onClick={handleCreateResume}
                        className="flex flex-col items-center justify-center p-8 h-64 rounded-3xl border-2 border-dashed border-zinc-800 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
                    >
                        <div className="p-4 bg-zinc-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-zinc-500 group-hover:text-purple-400" />
                        </div>
                        <span className="text-zinc-500 font-bold group-hover:text-white">New Resume</span>
                    </button>

                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="group relative flex flex-col p-6 h-64 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
                        >
                            <div className="flex-1">
                                <div className="p-3 bg-zinc-800 w-fit rounded-xl mb-4 text-zinc-500 group-hover:text-purple-400 group-hover:scale-110 transition-all">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold truncate group-hover:text-purple-300 transition-colors">
                                    {resume.title}
                                </h3>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Updated {new Date(resume.updated_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <Link
                                    href={`/editor/${resume.id}`}
                                    className="flex items-center space-x-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit</span>
                                </Link>
                                <button
                                    onClick={() => handleDeleteResume(resume.id)}
                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
