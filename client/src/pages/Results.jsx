import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrustMeter from '../components/TrustMeter';
import { Verified, AlertTriangle, XCircle, Share2, Download, ChevronRight, Binary, FileSearch, Fingerprint } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const report = location.state?.report;

    useEffect(() => {
        if (!report) {
            navigate('/analyze');
        }
    }, [report, navigate]);

    if (!report) return null;

    // Logic for status
    const isTrusted = report.trustScore >= 80;
    const isSuspicious = report.trustScore < 50;
    const isCaution = !isTrusted && !isSuspicious;

    const statusConfig = {
        trusted: { color: 'text-status-success', bg: 'bg-status-success/10', border: 'border-status-success/20', icon: Verified, label: 'Authentic Content' },
        suspicious: { color: 'text-status-error', bg: 'bg-status-error/10', border: 'border-status-error/20', icon: XCircle, label: 'Likely Manipulated' },
        caution: { color: 'text-status-warning', bg: 'bg-status-warning/10', border: 'border-status-warning/20', icon: AlertTriangle, label: 'Unverified / Inconclusive' }
    };

    const status = isTrusted ? statusConfig.trusted : isSuspicious ? statusConfig.suspicious : statusConfig.caution;
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-grow container mx-auto px-6 py-28">
                <div className="max-w-6xl mx-auto">

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link to="/" className="hover:text-white">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/analyze" className="hover:text-white">Analyze</Link>
                        <ChevronRight size={14} />
                        <span className="text-white">Results</span>
                    </div>


                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* LEFT COL: Summary Card */}
                        <div className="lg:col-span-1">
                            <div className="card p-8 flex flex-col items-center text-center sticky top-24">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${status.bg} ${status.border} ${status.color}`}>
                                    <StatusIcon size={18} />
                                    <span className="text-sm font-bold uppercase tracking-wide">{status.label}</span>
                                </div>

                                <TrustMeter score={report.trustScore} />

                                <div className="mt-8 pt-8 border-t border-white/5 w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-400 text-sm">Analysis Confidence</span>
                                        <span className="text-white font-medium">98.4%</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-gray-400 text-sm">Time Elapsed</span>
                                        <span className="text-white font-medium">1.2s</span>
                                    </div>

                                    <button className="btn-secondary w-full flex items-center justify-center gap-2 mb-3">
                                        <Download size={18} /> Download PDF
                                    </button>
                                    <button className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 w-full transition-colors">
                                        <Share2 size={16} /> Share Result
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: Detailed Modules */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Input Details */}
                            <div className="card p-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Input Source</h3>
                                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-gray-300 break-all border border-white/5">
                                    {report.input}
                                </div>
                            </div>

                            {/* Deepfake Analysis Module */}
                            <div className="card overflow-hidden">
                                <div className="bg-surface-highlight p-4 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Binary size={20} /></div>
                                        <h3 className="font-bold text-white">AI Content Analysis</h3>
                                    </div>
                                    <span className={`text-sm font-bold ${report.deepfakeProbability > 50 ? 'text-status-error' : 'text-status-success'}`}>
                                        {Math.round(report.deepfakeProbability)}% Probability
                                    </span>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-400 text-sm mb-4">
                                        Analyzed utilizing the Deepware Scanner v1 model. Scanned for GAN-generated artifacts, skin texture inconsistencies, and warping.
                                    </p>
                                    {/* Visual Bar */}
                                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden relative">
                                        <div
                                            className={`h-full absolute left-0 top-0 transition-all duration-1000 ${report.deepfakeProbability > 50 ? 'bg-status-error' : 'bg-status-success'}`}
                                            style={{ width: `${report.deepfakeProbability}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>Likely Human</span>
                                        <span>Likely AI</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fact Check Module */}
                            <div className="card overflow-hidden">
                                <div className="bg-surface-highlight p-4 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><FileSearch size={20} /></div>
                                        <h3 className="font-bold text-white">Fact Verification</h3>
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {report.factCheckScore}/100 Integrity
                                    </span>
                                </div>
                                <div className="p-6">
                                    {report.details?.references?.length > 0 ? (
                                        <div className="space-y-4">
                                            {report.details.references.map((ref, idx) => (
                                                <div key={idx} className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                                                    <div className="mt-1 min-w-[20px] h-5 w-5 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-white font-medium block mb-1">
                                                            {ref.title || "Untitled Reference"}
                                                        </a>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{ref.publisher}</span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                            <span>Verified Source</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500">
                                            <p>No direct match found in fact-check databases.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metadata Module */}
                            <div className="card overflow-hidden">
                                <div className="bg-surface-highlight p-4 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Fingerprint size={20} /></div>
                                        <h3 className="font-bold text-white">Metadata Forensics</h3>
                                    </div>
                                    <span className="text-sm font-bold text-status-success">Low Risk</span>
                                </div>
                                <div className="p-6 grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-black/20 rounded border border-white/5">
                                        <span className="text-xs text-gray-500 block mb-1">Container</span>
                                        <span className="text-sm text-gray-300">MPEG-4 / JPG</span>
                                    </div>
                                    <div className="p-3 bg-black/20 rounded border border-white/5">
                                        <span className="text-xs text-gray-500 block mb-1">Modification Date</span>
                                        <span className="text-sm text-gray-300">Matched</span>
                                    </div>
                                    <div className="p-3 bg-black/20 rounded border border-white/5">
                                        <span className="text-xs text-gray-500 block mb-1">Software Signature</span>
                                        <span className="text-sm text-gray-300">None detected</span>
                                    </div>
                                    <div className="p-3 bg-black/20 rounded border border-white/5">
                                        <span className="text-xs text-gray-500 block mb-1">GPS Data</span>
                                        <span className="text-sm text-gray-300">Absent</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Results;
