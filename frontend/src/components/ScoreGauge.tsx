import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
    score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 80) return '#4ade80'; // Green
        if (s >= 50) return '#facc15'; // Yellow
        return '#f87171'; // Red
    };

    const color = getColor(score);

    return (
        <div className="flex flex-col items-center justify-center p-6 relative">
            <svg width="150" height="150" className="transform -rotate-90">
                <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="12"
                    fill="none"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke={color}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {score}
                </span>
                <span className="block text-xs text-gray-400 uppercase tracking-widest mt-1">UX Score</span>
            </div>
        </div>
    );
};

export default ScoreGauge;
