import { useContext } from 'react';
import type { Sweet } from '../types';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit, ShoppingCart, AlertCircle, PlusCircle } from 'lucide-react';

interface Props {
    sweet: Sweet;
    onPurchase: (id: string) => void;
    onDelete: (id: string) => void;
    onRestock: (id: string) => void;
    onEdit: (sweet: Sweet) => void;
}

const SweetCard = ({ sweet, onPurchase, onDelete, onRestock, onEdit }: Props) => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{sweet.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{sweet.category}</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#a855f7' }}>${sweet.price}</span>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: sweet.quantity === 0 ? '#ef4444' : '#10b981' }}>
                <AlertCircle size={16} />
                <span>{sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}</span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                {isAdmin ? (
                    <>
                        <button onClick={() => onRestock(sweet._id)} className="btn-primary" style={{ flex: 1, background: '#3b82f6', fontSize: '0.9rem' }}>
                            <PlusCircle size={16} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> Restock
                        </button>
                        <button onClick={() => onEdit(sweet)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #94a3b8', background: 'transparent', color: 'white', cursor: 'pointer' }}>
                            <Edit size={18} />
                        </button>
                        <button onClick={() => onDelete(sweet._id)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                            <Trash2 size={18} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onPurchase(sweet._id)}
                        disabled={sweet.quantity === 0}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <ShoppingCart size={18} /> Purchase
                    </button>
                )}
            </div>
        </div>
    );
};

export default SweetCard;
