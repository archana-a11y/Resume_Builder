"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    Save,
    Eye,
    Download,
    Sparkles,
    ChevronLeft,
    Loader2,
    Plus,
    Trash2,
    User,
    Briefcase,
    GraduationCap,
    Code,
    Shield,
    Layout,
    Zap
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeContent {
    personalInfo?: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
    };
    experience?: Array<{
        company: string;
        role: string;
        duration: string;
        description: string;
    }>;
    education?: Array<{
        school: string;
        degree: string;
        year: string;
    }>;
    skills?: string[];
}

export default function EditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [content, setContent] = useState<ResumeContent>({
        personalInfo: { fullName: "", email: "", phone: "", location: "", summary: "" },
        experience: [{ company: "", role: "", duration: "", description: "" }],
        education: [{ school: "", degree: "", year: "" }],
        skills: [""]
    });
    const [templateId, setTemplateId] = useState("modern");
    const [title, setTitle] = useState("Untitled Resume");
    const [showMagicFill, setShowMagicFill] = useState(false);
    const [magicFillText, setMagicFillText] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [jobDesc, setJobDesc] = useState("");
    const [analysis, setAnalysis] = useState<any>(null);

    useEffect(() => {
        const fetchResume = async () => {
            const { data, error } = await supabase
                .from("resumes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                router.push("/dashboard");
                return;
            }

            if (data) {
                setTitle(data.title);
                setTemplateId(data.template_id || "modern");
                if (Object.keys(data.content).length > 0) {
                    setContent(data.content);
                }
            }
            setLoading(false);
        };

        fetchResume();
    }, [id, router]);

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from("resumes")
            .update({ title, content, template_id: templateId, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (!error) {
            setStatus("Saved!");
            setTimeout(() => setStatus(""), 2000);
        }
        setSaving(false);
    };

    const handleGenerateAI = async (section: string, index?: number) => {
        setSaving(true);
        setStatus("Generating...");

        let prompt = "";
        if (section === 'summary') {
            prompt = `Generate a professional summary for a resume. Name: ${content.personalInfo?.fullName}. Skills: ${content.skills?.join(', ')}.`;
        } else if (section === 'experience' && index !== undefined) {
            const exp = content.experience![index];
            prompt = `Improve this job description: Role: ${exp.role} at ${exp.company}. Current description: ${exp.description}`;
        }

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: section === 'summary' ? 'summary' : 'experience' })
            });
            const data = await res.json();

            if (data.content) {
                if (section === 'summary') {
                    setContent({ ...content, personalInfo: { ...content.personalInfo!, summary: data.content } });
                } else if (section === 'experience' && index !== undefined) {
                    const newExp = [...content.experience!];
                    newExp[index].description = data.content;
                    setContent({ ...content, experience: newExp });
                }
            }
            setStatus("Generated!");
        } catch (e) {
            console.error(e);
            setStatus("Error!");
        }
        setSaving(false);
        setTimeout(() => setStatus(""), 2000);
    };

    const handleExport = () => {
        window.print();
    };

    const handleAnalyzeATS = async () => {
        if (!jobDesc) return;
        setAnalyzing(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeContent: content,
                    jobDescription: jobDesc
                })
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (e) {
            console.error(e);
        }
        setAnalyzing(false);
    };

    const handleMagicFill = async () => {
        setSaving(true);
        setStatus("Magic in progress...");

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: magicFillText,
                    type: 'extract'
                })
            });
            const data = await res.json();

            if (data.content) {
                // The AI should return a JSON string that we parse
                const extracted = JSON.parse(data.content);
                setContent({
                    ...content,
                    ...extracted
                });
                setStatus("Magic successful!");
                setShowMagicFill(false);
                setMagicFillText("");
            }
        } catch (e) {
            console.error(e);
            setStatus("Magic failed!");
        }
        setSaving(false);
        setTimeout(() => setStatus(""), 2000);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white">
            {/* Sidebar - Control Panel */}
            <div className="w-1/2 flex flex-col border-r border-white/5 overflow-hidden no-print">
                <header className="p-4 border-b border-white/5 flex items-center justify-between backdrop-blur-md bg-black/50">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-transparent font-bold text-lg focus:outline-none border-b border-transparent focus:border-purple-500 transition-all w-48"
                        />
                    </div>
                    <div className="flex items-center space-x-3 no-print">
                        <span className="text-xs text-zinc-500 font-medium">{status}</span>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 text-white border border-white/10 rounded-lg text-sm font-bold hover:bg-zinc-700 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>Save</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export PDF</span>
                        </button>
                        <button
                            onClick={() => setShowMagicFill(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Magic Fill</span>
                        </button>
                        <button
                            onClick={() => setShowScanner(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 border border-white/10 text-white rounded-lg text-sm font-bold hover:bg-zinc-800 transition-all"
                        >
                            <Layout className="w-4 h-4 text-emerald-400" />
                            <span>ATS Scanner</span>
                        </button>
                    </div>
                </header>

                {/* ATS Scanner Modal */}
                <AnimatePresence>
                    {showScanner && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                            >
                                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-xl">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-emerald-500/20 rounded-2xl">
                                            <Shield className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">ATS Optimization Scanner</h3>
                                            <p className="text-zinc-500 text-sm">Analyze your match rate and beat the screening bots.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowScanner(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <Plus className="w-8 h-8 rotate-45 text-zinc-500" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8">
                                    {/* Left: Input */}
                                    <div className="w-full md:w-1/2 space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> Target Job Description
                                            </label>
                                            <textarea
                                                value={jobDesc}
                                                onChange={(e) => setJobDesc(e.target.value)}
                                                placeholder="Paste the job requirements here to find missing keywords and optimize your score..."
                                                rows={12}
                                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none font-medium"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAnalyzeATS}
                                            disabled={!jobDesc || analyzing}
                                            className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                                        >
                                            {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                            <span>Scan Resume Match</span>
                                        </button>
                                    </div>

                                    {/* Right: Results */}
                                    <div className="w-full md:w-1/2 space-y-8 bg-black/20 rounded-3xl p-6 border border-white/5">
                                        {!analysis ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                                <Sparkles className="w-12 h-12 text-zinc-800" />
                                                <p className="text-zinc-500 text-sm max-w-[200px]">Paste a job description and run the scan to see your result.</p>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-8"
                                            >
                                                {/* Score Circle */}
                                                <div className="flex items-center justify-between">
                                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                                        <svg className="w-full h-full -rotate-90">
                                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * analysis.score) / 100} className={`${analysis.score > 70 ? 'text-emerald-500' : analysis.score > 40 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} />
                                                        </svg>
                                                        <span className="absolute text-3xl font-black">{analysis.score}%</span>
                                                    </div>
                                                    <div className="flex-1 ml-8">
                                                        <h4 className="text-lg font-bold mb-1">Match Rating</h4>
                                                        <p className="text-zinc-500 text-xs leading-relaxed">{analysis.matchAnalysis}</p>
                                                    </div>
                                                </div>

                                                {/* Keywords */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Missing Keywords</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {analysis.missingKeywords.map((kw: string, i: number) => (
                                                            <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold leading-none">+ {kw}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Fixes */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-red-400">Critical Fixes</h4>
                                                    <div className="space-y-2">
                                                        {analysis.criticalFixes.map((fix: string, i: number) => (
                                                            <div key={i} className="flex items-start space-x-2 text-xs text-zinc-300">
                                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1 shrink-0" />
                                                                <span>{fix}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Suggestions */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">AI Advice</h4>
                                                    <div className="space-y-2">
                                                        {analysis.optimizationSuggestions.map((sug: string, i: number) => (
                                                            <div key={i} className="flex items-start space-x-2 text-xs text-zinc-300">
                                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1 shrink-0" />
                                                                <span>{sug}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {showMagicFill && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-xl font-bold">Magic Fill</h3>
                                </div>
                                <button onClick={() => setShowMagicFill(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <Plus className="w-6 h-6 rotate-45" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-zinc-400">Paste your LinkedIn profile text, an old resume, or a short bio. We'll extract the information and fill your resume automatically.</p>
                                <textarea
                                    value={magicFillText}
                                    onChange={(e) => setMagicFillText(e.target.value)}
                                    placeholder="e.g. I am a software engineer with 5 years of experience at Google and Amazon. I graduated from Stanford with a degree in CS..."
                                    rows={8}
                                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                                <button
                                    onClick={handleMagicFill}
                                    disabled={!magicFillText || saving}
                                    className="w-full py-4 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    <span>Extract & Fill Resume</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8 space-y-12">
                    {/* Template Switcher */}
                    <section className="space-y-4">
                        <div className="flex items-center space-x-2 text-zinc-400">
                            <Eye className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Choose Template</h2>
                        </div>
                        <div className="flex gap-4">
                            {["modern", "classic", "minimal", "creative"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTemplateId(t)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${templateId === t ? 'bg-purple-500 border-purple-500 text-white' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Personal Info */}
                    <section className="space-y-6">
                        <div className="flex items-center space-x-2 text-purple-400">
                            <User className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Full Name" value={content.personalInfo?.fullName} onChange={(val) => setContent({ ...content, personalInfo: { ...content.personalInfo!, fullName: val } })} />
                            <Input label="Email" value={content.personalInfo?.email} onChange={(val) => setContent({ ...content, personalInfo: { ...content.personalInfo!, email: val } })} />
                            <Input label="Phone" value={content.personalInfo?.phone} onChange={(val) => setContent({ ...content, personalInfo: { ...content.personalInfo!, phone: val } })} />
                            <Input label="Location" value={content.personalInfo?.location} onChange={(val) => setContent({ ...content, personalInfo: { ...content.personalInfo!, location: val } })} />
                        </div>
                        <div className="relative">
                            <Textarea
                                label="Professional Summary"
                                value={content.personalInfo?.summary}
                                onChange={(val) => setContent({ ...content, personalInfo: { ...content.personalInfo!, summary: val } })}
                            />
                            <button
                                onClick={() => handleGenerateAI('summary')}
                                className="absolute top-2 right-2 p-1.5 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-all group"
                                title="Generate with AI"
                            >
                                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-blue-400">
                                <Briefcase className="w-5 h-5" />
                                <h2 className="text-lg font-bold">Experience</h2>
                            </div>
                            <button
                                onClick={() => setContent({ ...content, experience: [...content.experience!, { company: "", role: "", duration: "", description: "" }] })}
                                className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {content.experience?.map((exp, i) => (
                            <div key={i} className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 space-y-4 relative group">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Company" value={exp.company} onChange={(val) => {
                                        const newExp = [...content.experience!];
                                        newExp[i].company = val;
                                        setContent({ ...content, experience: newExp });
                                    }} />
                                    <Input label="Role" value={exp.role} onChange={(val) => {
                                        const newExp = [...content.experience!];
                                        newExp[i].role = val;
                                        setContent({ ...content, experience: newExp });
                                    }} />
                                </div>
                                <Input label="Duration" value={exp.duration} onChange={(val) => {
                                    const newExp = [...content.experience!];
                                    newExp[i].duration = val;
                                    setContent({ ...content, experience: newExp });
                                }} />
                                <div className="relative">
                                    <Textarea label="Description" value={exp.description} onChange={(val) => {
                                        const newExp = [...content.experience!];
                                        newExp[i].description = val;
                                        setContent({ ...content, experience: newExp });
                                    }} />
                                    <button
                                        onClick={() => handleGenerateAI('experience', i)}
                                        className="absolute top-2 right-2 p-1.5 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setContent({ ...content, experience: content.experience?.filter((_, idx) => idx !== i) })}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </section>

                    {/* Education */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-emerald-400">
                                <GraduationCap className="w-5 h-5" />
                                <h2 className="text-lg font-bold">Education</h2>
                            </div>
                            <button
                                onClick={() => setContent({ ...content, education: [...content.education!, { school: "", degree: "", year: "" }] })}
                                className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {content.education?.map((edu, i) => (
                            <div key={i} className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 space-y-4 relative group">
                                <Input label="School" value={edu.school} onChange={(val) => {
                                    const newEdu = [...content.education!];
                                    newEdu[i].school = val;
                                    setContent({ ...content, education: newEdu });
                                }} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Degree" value={edu.degree} onChange={(val) => {
                                        const newEdu = [...content.education!];
                                        newEdu[i].degree = val;
                                        setContent({ ...content, education: newEdu });
                                    }} />
                                    <Input label="Year" value={edu.year} onChange={(val) => {
                                        const newEdu = [...content.education!];
                                        newEdu[i].year = val;
                                        setContent({ ...content, education: newEdu });
                                    }} />
                                </div>
                                <button
                                    onClick={() => setContent({ ...content, education: content.education?.filter((_, idx) => idx !== i) })}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </section>

                    {/* Skills */}
                    <section className="space-y-6 pb-20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-orange-400">
                                <Code className="w-5 h-5" />
                                <h2 className="text-lg font-bold">Skills</h2>
                            </div>
                            <button
                                onClick={() => setContent({ ...content, skills: [...content.skills!, ""] })}
                                className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {content.skills?.map((skill, i) => (
                                <div key={i} className="relative group">
                                    <input
                                        value={skill}
                                        onChange={(e) => {
                                            const newSkills = [...content.skills!];
                                            newSkills[i] = e.target.value;
                                            setContent({ ...content, skills: newSkills });
                                        }}
                                        placeholder="Skill name"
                                        className="block w-full px-3 py-2 bg-zinc-800/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                                    />
                                    <button
                                        onClick={() => setContent({ ...content, skills: content.skills?.filter((_, idx) => idx !== i) })}
                                        className="absolute -top-1 -right-1 p-0.5 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Preview Panel */}
            <div className={`w-1/2 bg-zinc-900 p-12 overflow-y-auto flex justify-center print:bg-white print:p-0 print:w-full print:overflow-visible ${templateId === 'classic' ? 'font-serif' : 'font-sans'}`}>
                <div id="resume-preview" className={`w-full max-w-[21cm] h-fit bg-white text-black shadow-2xl origin-top transition-all print:shadow-none print:max-w-none print:w-full ${templateId === 'creative' ? 'flex' : 'p-[2cm]'} ${templateId === 'minimal' ? 'p-[1.5cm]' : ''}`}>
                    {templateId === 'creative' ? (
                        <>
                            {/* Sidebar Layout for Creative */}
                            <div className="w-1/3 bg-zinc-100 p-8 space-y-8 h-full min-h-[29.7cm]">
                                <header className="space-y-4">
                                    <h1 className="text-3xl font-extrabold text-blue-600 leading-tight uppercase">
                                        {content.personalInfo?.fullName || "Your Name"}
                                    </h1>
                                    <div className="space-y-2 text-xs text-zinc-500 font-medium">
                                        <p>{content.personalInfo?.email}</p>
                                        <p>{content.personalInfo?.phone}</p>
                                        <p>{content.personalInfo?.location}</p>
                                    </div>
                                </header>

                                <section className="space-y-4">
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {content.skills?.map((skill, i) => skill && (
                                            <span key={i} className="px-2 py-1 bg-white text-zinc-700 text-[10px] font-bold rounded shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">Education</h2>
                                    <div className="space-y-4">
                                        {content.education?.map((edu, i) => (
                                            <div key={i} className="space-y-1">
                                                <h3 className="font-bold text-xs">{edu.school}</h3>
                                                <p className="text-[10px] text-zinc-600">{edu.degree}</p>
                                                <p className="text-[10px] text-zinc-400">{edu.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            {/* Main Content for Creative */}
                            <div className="w-2/3 p-10 space-y-8 bg-white">
                                <section className="space-y-4">
                                    <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full" /> Summary
                                    </h2>
                                    <p className="text-sm text-zinc-600 leading-relaxed italic">
                                        {content.personalInfo?.summary}
                                    </p>
                                </section>
                                <section className="space-y-6">
                                    <h2 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full" /> Experience
                                    </h2>
                                    <div className="space-y-8">
                                        {content.experience?.map((exp, i) => (
                                            <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-zinc-100">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-base text-zinc-900">{exp.role}</h3>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">{exp.duration}</span>
                                                </div>
                                                <p className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">{exp.company}</p>
                                                <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                                    {exp.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8">
                            {/* Standard Layout Rendering */}
                            <header className={`${templateId === 'classic' ? 'text-center border-b-[3px] border-black pb-8' : 'border-b-4 border-indigo-600 pb-6'} ${templateId === 'minimal' ? 'border-none pb-0 text-left' : ''} ${templateId === 'modern' ? 'bg-zinc-50 -mx-8 -mt-8 p-12 mb-8' : ''}`}>
                                <h1 className={`${templateId === 'classic' ? 'text-5xl font-bold uppercase tracking-[4px]' : 'text-4xl font-black uppercase tracking-tight'} ${templateId === 'minimal' ? 'text-3xl font-medium tracking-normal normal-case border-b border-zinc-100 pb-4' : ''} ${templateId === 'modern' ? 'text-indigo-600 mb-2' : ''}`}>
                                    {content.personalInfo?.fullName || "Your Name"}
                                </h1>
                                <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 mt-4 font-medium ${templateId === 'classic' ? 'justify-center uppercase tracking-widest text-[10px]' : ''} ${templateId === 'minimal' ? 'mt-3 text-zinc-400 font-light' : ''}`}>
                                    <span className="hover:text-black transition-colors">{content.personalInfo?.email}</span>
                                    {content.personalInfo?.phone && (
                                        <>
                                            <span className={templateId === 'minimal' ? 'hidden' : 'text-zinc-300'}>•</span>
                                            <span>{content.personalInfo?.phone}</span>
                                        </>
                                    )}
                                    {content.personalInfo?.location && (
                                        <>
                                            <span className={templateId === 'minimal' ? 'hidden' : 'text-zinc-300'}>•</span>
                                            <span>{content.personalInfo?.location}</span>
                                        </>
                                    )}
                                </div>
                            </header>

                            <section className={templateId === 'minimal' ? 'pt-4 border-t border-zinc-50' : ''}>
                                <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${templateId === 'modern' ? 'text-indigo-600' : 'text-zinc-400'} ${templateId === 'classic' ? 'italic' : ''} ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                    Professional Summary
                                </h2>
                                <p className={`text-sm leading-relaxed text-zinc-800 ${templateId === 'classic' ? 'text-justify' : ''} ${templateId === 'minimal' ? 'text-zinc-600 font-light' : ''} ${templateId === 'modern' ? 'border-l-4 border-indigo-100 pl-4 py-1' : ''}`}>
                                    {content.personalInfo?.summary}
                                </p>
                            </section>

                            <section>
                                <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${templateId === 'modern' ? 'text-indigo-600' : 'text-zinc-400'} ${templateId === 'classic' ? 'italic' : ''} ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                    Experience
                                </h2>
                                <div className="space-y-8">
                                    {content.experience?.map((exp, i) => (
                                        <div key={i} className={templateId === 'minimal' ? 'pb-4' : ''}>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className={`font-bold text-base ${templateId === 'minimal' ? 'text-sm font-medium' : ''} ${templateId === 'modern' ? 'text-zinc-900' : ''}`}>{exp.role}</h3>
                                                <span className={`text-sm text-zinc-500 whitespace-nowrap font-bold ${templateId === 'minimal' ? 'text-xs font-light' : ''} ${templateId === 'modern' ? 'text-indigo-600' : ''}`}>{exp.duration}</span>
                                            </div>
                                            <p className={`text-sm font-bold text-zinc-600 mb-3 ${templateId === 'minimal' ? 'text-xs font-medium text-zinc-400 tracking-wide uppercase' : ''} ${templateId === 'modern' ? 'italic opacity-70' : ''}`}>
                                                {exp.company}
                                            </p>
                                            <div className={`text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap ${templateId === 'minimal' ? 'text-zinc-600 font-light' : ''}`}>
                                                {exp.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {content.education && content.education.length > 0 && (
                                <section>
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${templateId === 'modern' ? 'text-indigo-600' : 'text-zinc-400'} ${templateId === 'classic' ? 'italic' : ''} ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                        Education
                                    </h2>
                                    <div className="space-y-4">
                                        {content.education.map((edu, i) => (
                                            <div key={i} className="flex justify-between items-baseline">
                                                <div>
                                                    <h3 className={`font-bold text-sm ${templateId === 'minimal' ? 'font-medium' : ''}`}>{edu.school}</h3>
                                                    <p className={`text-sm text-zinc-600 font-medium ${templateId === 'minimal' ? 'text-xs font-light text-zinc-400' : ''}`}>{edu.degree}</p>
                                                </div>
                                                <span className={`text-sm text-zinc-500 whitespace-nowrap font-bold ${templateId === 'minimal' ? 'text-xs font-light' : ''} ${templateId === 'modern' ? 'text-indigo-600' : ''}`}>{edu.year}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {content.skills && content.skills.length > 0 && (
                                <section>
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${templateId === 'modern' ? 'text-indigo-600' : 'text-zinc-400'} ${templateId === 'classic' ? 'italic' : ''} ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                        Skills
                                    </h2>
                                    <div className={`flex flex-wrap gap-2 ${templateId === 'classic' ? 'justify-center' : ''}`}>
                                        {content.skills.map((skill, i) => skill && (
                                            <span key={i} className={`px-2 py-1 text-xs font-bold rounded ${templateId === 'modern' ? 'bg-indigo-50 text-indigo-700' : ''} ${templateId === 'classic' ? 'border border-zinc-200 text-zinc-800 rounded-none' : ''} ${templateId === 'minimal' ? 'text-zinc-500 font-light p-0 pr-3 after:content-[","] last:after:content-[""]' : ''}`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange }: { label: string, value?: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">{label}</label>
            <input
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full px-3 py-2 bg-zinc-800/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-medium"
            />
        </div>
    );
}

function Textarea({ label, value, onChange }: { label: string, value?: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">{label}</label>
            <textarea
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 bg-zinc-800/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-medium resize-none"
            />
        </div>
    );
}
