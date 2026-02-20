import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

interface ReviewCardProps {
    id: string;
    url: string;
    created_at: string;
    ux_review: {
        uxScore: number;
        issues: any[];
    };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ id, url, created_at, ux_review }) => {
    const score = ux_review?.uxScore || 0;
    const scoreColor = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';

    return (
        <Link to={`/review/${id}`} className="block group">
            <div className="glass-card flex items-center justify-between hover:bg-white/5 transition p-4 rounded-xl cursor-pointer border border-white/5 hover:border-white/10">
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-medium text-white truncate group-hover:text-blue-400 transition">{url}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Clock size={14} />
                        <span>{new Date(created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${scoreColor}`}>{score}</div>
                        <div className="text-xs text-gray-400 uppercase">Score</div>
                    </div>
                    <ArrowRight className="text-gray-500 group-hover:text-white transition transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

export default ReviewCard;
