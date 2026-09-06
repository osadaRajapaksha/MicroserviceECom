import { useEffect, useState } from 'react';
import { fetchRecommendations } from '../api';
import { useCart } from '../context/CartContext';
import './AiRecommendations.css';

interface Recommendation {
    productId: string;
    productName: string;
    reason: string;
}

export const AiRecommendations = ({ userId }: { userId: string }) => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const load = async () => {
            try {
                // In a real app, userId would be dynamic based on the logged-in user.
                const data = await fetchRecommendations(userId);
                setRecommendations(data);
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setLoading(false);
            }
        };
        
        load();
    }, [userId]);

    if (loading) return null;
    if (recommendations.length === 0) return null;

    return (
        <div className="ai-recommendations-container">
            <div className="ai-header">
                <span className="sparkle-icon">✨</span>
                <h3>AI Suggested For You</h3>
            </div>
            <div className="recommendations-grid">
                {recommendations.map((rec) => (
                    <div key={rec.productId} className="recommendation-card glass">
                        <div className="rec-content">
                            <h4>{rec.productName}</h4>
                            <p className="rec-reason">{rec.reason}</p>
                        </div>
                        <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => addToCart({ id: rec.productId, name: rec.productName, description: rec.reason, price: 99.99 })}
                        >
                            + Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
