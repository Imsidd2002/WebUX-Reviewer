import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitReview, getRecentReviews } from '../api';
import ReviewCard from '../components/ReviewCard';
import { Search, Loader2 } from 'lucide-react';

const Home: React.FC = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadRecent();
    }, []);

    const loadRecent = async () => {
        try {
            const data = await getRecentReviews();
            if (Array.isArray(data)) setRecentReviews(data);
        } catch (e: any) {
            console.error("Failed to load recent reviews", e);
        }
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);

        try {
            const result = await submitReview(url);
            navigate(`/review/${result.id}`);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to analyze website. Ensure URL is correct.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-sm">
                    Website UX Reviewer
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Instant, AI-powered UX audits for any website. Get actionable insights to improve clarity, accessibility, and conversion.
                </p>
            </div>

            {/* Input Section */}
            <div className="glass p-8 rounded-2xl mb-12 shadow-2xl ring-1 ring-white/10">
                <form onSubmit={handleReview} className="flex gap-4 flex-col md:flex-row">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-500" />
                        </div>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            className="w-full bg-black/20 border border-white/10 text-white placeholder-gray-500 text-lg rounded-xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-blue-500/20"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Analyzing...
                            </span>
                        ) : (
                            'Generate Review'
                        )}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center animate-pulse">
                        {error}
                    </div>
                )}
            </div>

            {/* Recent Reviews */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Recent Audits</h2>
                <div className="grid gap-4">
                    {recentReviews.length > 0 ? (
                        recentReviews.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">No recent reviews found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
