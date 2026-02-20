import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReview } from '../api';
import ScoreGauge from '../components/ScoreGauge';
import ExportPDFButton from '../components/ExportPDFButton';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Review: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [review, setReview] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchReview(id);
    }, [id]);

    const fetchReview = async (reviewId: string) => {
        try {
            setLoading(true);
            const data = await getReview(reviewId);
            setReview(data);
        } catch (err: any) {
            setError('Review not found.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading review...</div>;
    if (error || !review) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

    const { uxScore, issues } = review.ux_review;
    const groupedIssues = issues.reduce((acc: any, issue: any) => {
        (acc[issue.category] = acc[issue.category] || []).push(issue);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pb-20 px-4 pt-10 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
                    <ArrowLeft size={20} /> Back to Search
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 truncate max-w-lg">
                        {review.url}
                    </h1>
                    <ExportPDFButton review={review} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Score Card */}
                <div className="md:col-span-1">
                    <div className="glass p-8 rounded-2xl flex flex-col items-center sticky top-24">
                        <h3 className="text-xl font-semibold text-gray-300 mb-4">Overall UX Score</h3>
                        <ScoreGauge score={uxScore} />
                        <div className="mt-8 space-y-4 w-full">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Issues Found</span>
                                <span className="text-white font-mono">{issues.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Categories</span>
                                <span className="text-white font-mono">{Object.keys(groupedIssues).length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Scan Date</span>
                                <span className="text-white font-mono">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Issues */}
                <div className="md:col-span-2 space-y-8">
                    {/* Top Improvements */}
                    <div className="glass p-8 rounded-2xl border-l-4 border-l-blue-500">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <AlertTriangle className="text-yellow-400" /> Key Improvements
                        </h2>

                        <div className="space-y-8">
                            {issues.filter((i: any) => i.suggestionBefore && i.suggestionAfter).slice(0, 3).map((issue: any, idx: number) => (
                                <div key={idx} className="bg-black/20 p-6 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
                                        {issue.category}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{issue.title}</h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                            <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-2 uppercase">
                                                <XCircle size={14} /> Current State
                                            </div>
                                            <p className="font-mono text-sm text-red-200 opacity-80 break-words">{issue.suggestionBefore}</p>
                                        </div>
                                        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-2 uppercase">
                                                <CheckCircle size={14} /> Suggested Improvement
                                            </div>
                                            <p className="font-mono text-sm text-green-200 opacity-80 break-words">{issue.suggestionAfter}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* All Issues Grouped */}
                    {Object.entries(groupedIssues).map(([category, items]: [string, any]) => (
                        <div key={category} className="glass p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">{category}</h3>
                            <div className="space-y-4">
                                {items.map((issue: any, idx: number) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx}
                                        className="p-4 rounded-lg hover:bg-white/5 transition"
                                    >
                                        <h4 className="font-semibold text-gray-200 mb-1">{issue.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{issue.description}</p>
                                        {issue.proof && (
                                            <div className="mt-2 text-xs text-gray-500 italic bg-black/20 p-2 rounded inline-block">
                                                Observed: "{issue.proof.substring(0, 100)}..."
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Review;
