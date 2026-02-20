import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface ReviewData {
    url: string;
    ux_review: {
        uxScore: number;
        issues: Array<{
            title: string;
            category: string;
            description: string;
            proof: string;
            suggestionBefore: string;
            suggestionAfter: string;
        }>;
    };
    created_at?: string;
}

interface ExportPDFButtonProps {
    review: ReviewData;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ review }) => {
    const handleExport = () => {
        const doc = new jsPDF();
        const margin = 20;
        let y = margin;

        // Header
        doc.setFontSize(22);
        doc.text('UX Review Report', margin, y);
        y += 10;

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`URL: ${review.url}`, margin, y);
        y += 8;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
        y += 15;

        // Score
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(`UX Score: ${review.ux_review.uxScore}/100`, margin, y);
        y += 15;

        // Issues
        doc.setFontSize(14);
        doc.text('Detailed Analysis', margin, y);
        y += 10;

        const groupedIssues = review.ux_review.issues.reduce((acc: any, issue) => {
            acc[issue.category] = acc[issue.category] || [];
            acc[issue.category].push(issue);
            return acc;
        }, {});

        Object.keys(groupedIssues).forEach((category) => {
            if (y > 270) { doc.addPage(); y = margin; }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(category, margin, y);
            y += 7;

            groupedIssues[category].forEach((issue: any) => {
                if (y > 270) { doc.addPage(); y = margin; }

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                doc.text(`• ${issue.title}`, margin + 5, y);
                y += 6;

                // Description wrapped text
                const descLines = doc.splitTextToSize(issue.description, 170);
                doc.setFontSize(10);
                doc.setTextColor(80);
                doc.text(descLines, margin + 5, y);
                y += (descLines.length * 5) + 5;
            });
            y += 5;
        });

        // Top Suggestions
        doc.addPage();
        y = margin;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Top Improvements', margin, y);
        y += 10;

        review.ux_review.issues.filter(i => i.suggestionBefore && i.suggestionAfter).slice(0, 3).forEach((issue) => {
            if (y > 250) { doc.addPage(); y = margin; }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(issue.title, margin, y);
            y += 7;

            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor(200, 0, 0);
            doc.text(`Before: "${issue.suggestionBefore}"`, margin, y);
            y += 7;

            doc.setTextColor(0, 150, 0);
            doc.text(`After: "${issue.suggestionAfter}"`, margin, y);
            y += 15;
            doc.setTextColor(0);
        });

        doc.save(`ux-review-${Date.now()}.pdf`);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
        >
            <Download size={18} />
            Export PDF
        </button>
    );
};

export default ExportPDFButton;
