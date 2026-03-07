"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    Plus,
    Trash2,
    ExternalLink,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    Building2,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLUMNS = [
    { id: "Wishlist", label: "Wishlist", color: "text-zinc-400" },
    { id: "Applied", label: "Applied", color: "text-blue-400" },
    { id: "Interview", label: "Interview", color: "text-purple-400" },
    { id: "Offer", label: "Offer", color: "text-emerald-400" },
    { id: "Rejected", label: "Rejected", color: "text-red-400" }
];

export default function TrackerBoard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ company_name: "", role_title: "", status: "Wishlist" });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setApplications(data || []);
        }
    };

    const handleAdd = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from("applications").insert([{
            ...newItem,
            user_id: user.id
        }]);

        if (!error) {
            fetchApplications();
            setShowAddModal(false);
            setNewItem({ company_name: "", role_title: "", status: "Wishlist" });
        }
    };

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from("applications").update({ status }).eq("id", id);
        if (!error) {
            setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
        }
    };

    const deleteApp = async (id: string) => {
        const { error } = await supabase.from("applications").delete().eq("id", id);
        if (!error) {
            setApplications(applications.filter(app => app.id !== id));
        }
    };

    const getIcon = (status: string) => {
        switch (status) {
            case "Wishlist": return <Clock className="w-4 h-4" />;
            case "Applied": return <ExternalLink className="w-4 h-4" />;
            case "Interview": return <MessageSquare className="w-4 h-4" />;
            case "Offer": return <CheckCircle2 className="w-4 h-4" />;
            case "Rejected": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Job Tracker</h2>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">Manage your applications</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Job</span>
                </button>
            </header>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                {COLUMNS.map(col => (
                    <div key={col.id} className="min-w-[320px] max-w-[320px] flex flex-col space-y-4 snap-start">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center space-x-3">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${col.color}`}>{col.label}</span>
                                <span className="bg-white/5 px-2 py-0.5 rounded-full text-[10px] font-bold text-zinc-500">
                                    {applications.filter(app => app.status === col.id).length}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 min-h-[500px] rounded-[32px] bg-white/[0.02] border border-white/5 p-4">
                            <AnimatePresence mode="popLayout">
                                {applications
                                    .filter(app => app.status === col.id)
                                    .map((app) => (
                                        <motion.div
                                            key={app.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="glass p-6 rounded-[28px] border border-white/5 space-y-4 group cursor-grab active:cursor-grabbing hover:border-white/10 transition-all shadow-lg"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2 text-zinc-500">
                                                        <Building2 className="w-3 h-3" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest truncate">{app.company_name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button onClick={() => deleteApp(app.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                        {app.status === 'Interview' && (
                                                            <Link
                                                                href={`/interview/${app.id}`}
                                                                className="p-1 px-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center space-x-1"
                                                            >
                                                                <Sparkles className="w-2 h-2" />
                                                                <span>Prep</span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-sm truncate">{app.role_title}</h4>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className={`p-2 rounded-xl bg-white/5 ${col.color}`}>
                                                    {getIcon(app.status)}
                                                </div>
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                                    className="bg-zinc-900/50 border-none text-[10px] font-black uppercase tracking-widest text-zinc-500 focus:ring-0 rounded-lg py-1 px-2 appearance-none cursor-pointer hover:text-zinc-300 transition-colors"
                                                >
                                                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] w-full max-w-md shadow-2xl space-y-6"
                        >
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tight">Add New Job</h3>
                                <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Where are you applying?</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Company</label>
                                    <input
                                        type="text"
                                        value={newItem.company_name}
                                        onChange={(e) => setNewItem({ ...newItem, company_name: e.target.value })}
                                        placeholder="e.g. Google"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Role</label>
                                    <input
                                        type="text"
                                        value={newItem.role_title}
                                        onChange={(e) => setNewItem({ ...newItem, role_title: e.target.value })}
                                        placeholder="e.g. Product Designer"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Initial Status</label>
                                    <select
                                        value={newItem.status}
                                        onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                                    >
                                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-4 bg-zinc-800 text-zinc-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!newItem.company_name || !newItem.role_title}
                                    className="flex-1 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-xl shadow-white/5"
                                >
                                    Save Job
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
