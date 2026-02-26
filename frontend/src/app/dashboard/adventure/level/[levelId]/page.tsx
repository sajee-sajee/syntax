"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Send, Terminal as TerminalIcon, CheckCircle2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";

export default function LevelEditor() {
    const { levelId } = useParams();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [level, setLevel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const res = await api.get(`/adventure/levels/${levelId}`);
                if (res.data.success) {
                    const lvl = res.data.data;
                    setLevel(lvl);
                    if (lvl.problem?.starterCode) {
                        setCode(lvl.problem.starterCode[language] || "");
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (levelId) fetchLevel();
    }, [levelId, language]);

    const handleRun = async () => {
        setOutput("Compiling and executing in Sandbox Environment...\n\n[Status: Pending Integration with Judge Service]");
        // Run is practically same as submit but maybe doesn't save attempt. For MVP we'll just use submit.
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (!level?.problem?.id) return;

        setIsSubmitting(true);
        setOutput("Connecting to Kernel...\nExecuting code in secure sandbox...\n");

        try {
            const res = await api.post(`/execute/submit/${level.problem.id}`, {
                language,
                code
            });

            if (res.data.success) {
                const attempt = res.data.data;
                let out = `Status: ${attempt.status.toUpperCase()}\n`;
                out += `Tests Passed: ${attempt.testsPassed} / ${attempt.testsTotal}\n`;
                out += `Runtime: ${attempt.execTimeMs}ms\n`;
                out += `Memory: ${attempt.memoryMb}MB\n\n`;

                if (attempt.status === 'accepted') {
                    out += "SUCCESS: Anomaly resolved.\nAll tests passed. System stabilizing.\n";
                } else {
                    out += "FAILURE: Neural link disrupted. Check your logic and try again.\n";
                }
                setOutput(out);
            }
        } catch (err) {
            const error = err as { response?: { data?: { error?: string } }, message?: string };
            setOutput(`ERROR: ${error.response?.data?.error || error.message}\nConnection to Kernel lost.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-700">

            {/* Left Pane: Story & Problem */}
            <div className="w-full lg:w-1/2 flex flex-col bg-black/40 border border-white/10 rounded-2xl overflow-hidden box-glow">
                <div className="p-4 border-b border-white/10 bg-black/60 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                    <span className="text-brand-400 font-mono text-xs font-bold px-2 py-1 rounded bg-brand-500/10">
                        SECTOR {level?.order}
                    </span>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <h1 className="text-3xl font-black mb-6 text-white text-glow">{level?.title}</h1>

                    <div className="prose prose-invert prose-brand max-w-none mb-8">
                        <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl mb-6 text-brand-100 italic">
                            &quot;{level?.storyIntro}&quot;
                        </div>
                        <ReactMarkdown>{level?.learningMd}</ReactMarkdown>
                    </div>

                    {level?.problem && (
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <TerminalIcon className="w-5 h-5 text-neon-blue" />
                                Problem Specification
                            </h2>
                            <div className="prose prose-invert max-w-none mb-6">
                                <ReactMarkdown>{level.problem.description}</ReactMarkdown>
                            </div>

                            {level.problem.testCases?.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Example Cases</h3>
                                    {level.problem.testCases.map((tc: { id: string, input: string, expectedOutput: string }) => (
                                        <div key={tc.id} className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm">
                                            <div className="text-gray-400 mb-1">Input: <span className="text-white">{tc.input}</span></div>
                                            <div className="text-gray-400">Expected Output: <span className="text-brand-400">{tc.expectedOutput}</span></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Editor & Output */}
            {level?.problem && (
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="flex-1 bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden flex flex-col box-glow relative">

                        {/* Editor Header */}
                        <div className="h-12 bg-black/60 border-b border-white/10 flex items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-black border border-white/20 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-brand-500"
                                >
                                    <option value="python">Python 3.12</option>
                                    <option value="javascript">Node.js</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleRun}
                                    className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-2 transition-colors"
                                >
                                    <Play className="w-4 h-4" /> Run
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-4 py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold flex items-center gap-2 transition-colors shadow-[0_0_10px_rgba(14,165,233,0.3)] disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" /> Submit Fix
                                </button>
                            </div>
                        </div>

                        {/* Monaco Editor */}
                        <div className="flex-1 relative">
                            <Editor
                                height="100%"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val || "")}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    smoothScrolling: true,
                                    cursorBlinking: "smooth",
                                }}
                            />
                        </div>
                    </div>

                    {/* Terminal Output */}
                    <div className="h-48 bg-black/80 border border-white/10 rounded-2xl p-4 font-mono text-sm overflow-y-auto box-glow relative group">
                        <div className="flex items-center justify-between mb-2 text-gray-500 text-xs tracking-widest uppercase">
                            <span>Execution Sandbox</span>
                            {output && output.includes('SUCCESS') ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <TerminalIcon className="w-4 h-4" />}
                        </div>

                        {output ? (
                            <pre className={`whitespace-pre-wrap ${output.includes('SUCCESS') ? 'text-green-400 text-glow' : 'text-gray-300'}`}>
                                {output}
                            </pre>
                        ) : (
                            <div className="text-gray-600 italic mt-8 text-center">
                                Awaiting compile instruction...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
