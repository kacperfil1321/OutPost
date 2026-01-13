import { useState } from 'react';
import { useStore } from '../../store';

export default function Support() {
    const { user, submitIssueReport } = useStore();
    const [reportType, setReportType] = useState('damage');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');

    const handleReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!user) {
            setMessage({ type: 'error', text: 'You must be logged in to submit a report.' });
            return;
        }

        const success = await submitIssueReport({
            userId: user.id,
            trackingNumber,
            issueType: reportType,
            description
        });

        if (success) {
            setMessage({ type: 'success', text: `Report Submitted successfully for ${trackingNumber}.` });
            setValuesReset();
        } else {
            setMessage({ type: 'error', text: 'Failed to submit report. Please try again.' });
        }
    };

    const handleRate = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Rating Submitted: ${rating}/5`);
        setFeedback('');
        setRating(5);
    };

    const setValuesReset = () => {
        setTrackingNumber('');
        setDescription('');
        setReportType('damage');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
            <h1>Support Center</h1>

            <div className="card">
                <h2>Report an Issue</h2>
                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>
                        Issue Type
                        <select value={reportType} onChange={e => setReportType(e.target.value)}>
                            <option value="damage">Package Damaged</option>
                            <option value="lost">Package Lost</option>
                            <option value="delay">Delay Complaint</option>
                        </select>
                    </label>

                    <label>
                        Tracking Number
                        <input
                            value={trackingNumber}
                            onChange={e => setTrackingNumber(e.target.value)}
                            placeholder="OUT-XXXX"
                            required
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                        />
                    </label>

                    <button type="submit" style={{ backgroundColor: 'var(--error)', color: 'white' }}>Submit Report</button>
                </form>
            </div>

            <div className="card">
                <h2>Rate Our Service</h2>
                <form onSubmit={handleRate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '2rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                style={{ cursor: 'pointer', color: star <= rating ? 'var(--primary)' : 'gray' }}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <textarea
                        placeholder="Tell us what you think..."
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                    />

                    <button type="submit" className="primary">Submit Rating</button>
                </form>
            </div>
        </div>
    );
}
