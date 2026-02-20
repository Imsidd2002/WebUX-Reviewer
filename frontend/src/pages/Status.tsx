import React, { useEffect, useState } from 'react';
import { checkStatus } from '../api';
import { Database, Server, Cpu } from 'lucide-react';

const Status: React.FC = () => {
    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        checkStatus().then(setStatus).catch(() => setStatus({ backend: 'error' }));
    }, []);

    const StatusItem = ({ label, value, icon: Icon }: any) => {
        const isOk = value === 'ok';


        return (
            <div className={`p-6 rounded-2xl border flex items-center justify-between ${isOk ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isOk ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{label}</h3>
                        <p className={`text-sm ${isOk ? 'text-green-300' : 'text-red-300'}`}>{isOk ? 'Operational' : 'Issue Detected'}</p>
                    </div>
                </div>
                <div className={`text-sm px-3 py-1 rounded-full font-mono ${isOk ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-300'}`}>
                    {value || 'unknown'}
                </div>
            </div>
        );
    };

    if (!status) return <div className="text-white text-center pt-20">Checking systems...</div>;

    return (
        <div className="min-h-screen pt-20 px-4 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">System Status</h1>

            <div className="space-y-4">
                <StatusItem label="Backend API" value={status.backend} icon={Server} />
                <StatusItem label="Supabase Database" value={status.database} icon={Database} />
                <StatusItem label="Groq LLM Engine" value={status.llm} icon={Cpu} />
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                Last checked: {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default Status;
