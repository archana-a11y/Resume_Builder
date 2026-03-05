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
    Code
} from "lucide-react";
import Link from "next/link";

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
                    </div>
                </header>

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
                            {["modern", "classic", "minimal"].map((t) => (
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
                <div className={`w-full max-w-[21cm] h-fit bg-white text-black p-[2.5cm] shadow-2xl origin-top transition-all print:shadow-none print:max-w-none print:w-full ${templateId === 'minimal' ? 'p-[1.5cm]' : ''}`}>
                    <div className="space-y-8">
                        {/* Template-specific Header Rendering */}
                        <header className={`${templateId === 'classic' ? 'text-center border-b-[3px] border-black pb-8' : 'border-b-2 border-zinc-200 pb-6'} ${templateId === 'minimal' ? 'border-none pb-0 text-left' : ''}`}>
                            <h1 className={`${templateId === 'classic' ? 'text-5xl font-bold uppercase tracking-[4px]' : 'text-4xl font-extrabold uppercase tracking-tight'} ${templateId === 'minimal' ? 'text-3xl font-medium tracking-normal normal-case border-b border-zinc-100 pb-4' : ''}`}>
                                {content.personalInfo?.fullName || "Your Name"}
                            </h1>
                            <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 mt-4 font-medium ${templateId === 'classic' ? 'justify-center uppercase tracking-widest text-[10px]' : ''} ${templateId === 'minimal' ? 'mt-3 text-zinc-400 font-light' : ''}`}>
                                <span>{content.personalInfo?.email}</span>
                                {content.personalInfo?.phone && (
                                    <>
                                        <span className={templateId === 'minimal' ? 'hidden' : ''}>•</span>
                                        <span>{content.personalInfo?.phone}</span>
                                    </>
                                )}
                                {content.personalInfo?.location && (
                                    <>
                                        <span className={templateId === 'minimal' ? 'hidden' : ''}>•</span>
                                        <span>{content.personalInfo?.location}</span>
                                    </>
                                )}
                            </div>
                        </header>

                        <section className={templateId === 'minimal' ? 'pt-4 border-t border-zinc-50' : ''}>
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 italic ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                Professional Summary
                            </h2>
                            <p className={`text-sm leading-relaxed text-zinc-800 ${templateId === 'classic' ? 'text-justify' : ''} ${templateId === 'minimal' ? 'text-zinc-600 font-light' : ''}`}>
                                {content.personalInfo?.summary}
                            </p>
                        </section>

                        <section>
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 italic ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                Experience
                            </h2>
                            <div className="space-y-8">
                                {content.experience?.map((exp, i) => (
                                    <div key={i} className={templateId === 'minimal' ? 'pb-4' : ''}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-bold text-base ${templateId === 'minimal' ? 'text-sm font-medium' : ''}`}>{exp.role}</h3>
                                            <span className={`text-sm text-zinc-500 whitespace-nowrap ${templateId === 'minimal' ? 'text-xs font-light' : ''}`}>{exp.duration}</span>
                                        </div>
                                        <p className={`text-sm font-bold text-zinc-600 mb-3 ${templateId === 'minimal' ? 'text-xs font-medium text-zinc-400 tracking-wide uppercase' : ''}`}>
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
                                <h2 className={`text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 italic ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {content.education.map((edu, i) => (
                                        <div key={i} className="flex justify-between items-baseline">
                                            <div>
                                                <h3 className={`font-bold text-sm ${templateId === 'minimal' ? 'font-medium' : ''}`}>{edu.school}</h3>
                                                <p className={`text-sm text-zinc-600 font-medium ${templateId === 'minimal' ? 'text-xs font-light text-zinc-400' : ''}`}>{edu.degree}</p>
                                            </div>
                                            <span className={`text-sm text-zinc-500 whitespace-nowrap ${templateId === 'minimal' ? 'text-xs font-light' : ''}`}>{edu.year}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {content.skills && content.skills.length > 0 && (
                            <section>
                                <h2 className={`text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 italic ${templateId === 'minimal' ? 'not-italic font-medium text-zinc-300 mb-2 lowercase' : ''}`}>
                                    Skills
                                </h2>
                                <div className={`flex flex-wrap gap-2 ${templateId === 'classic' ? 'justify-center' : ''}`}>
                                    {content.skills.map((skill, i) => skill && (
                                        <span key={i} className={`px-2 py-1 text-xs font-bold rounded ${templateId === 'modern' ? 'bg-zinc-100 text-zinc-700' : ''} ${templateId === 'classic' ? 'border border-zinc-200 text-zinc-800 rounded-none' : ''} ${templateId === 'minimal' ? 'text-zinc-500 font-light p-0 pr-3 after:content-[","] last:after:content-[""]' : ''}`}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
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
