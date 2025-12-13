import { useEffect, useState, useContext } from 'react';
import client from '../api/client';
import type { Sweet } from '../types';
import SweetCard from '../components/SweetCard';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [query, setQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Admin Form State
    const [showForm, setShowForm] = useState(false);
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });

    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'ADMIN';

    const fetchSweets = async () => {
        try {
            let url = `/sweets/search?q=${query}`;
            if (minPrice) url += `&minPrice=${minPrice}`;
            if (maxPrice) url += `&maxPrice=${maxPrice}`;

            const res = await client.get(url);
            setSweets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchSweets();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [query, minPrice, maxPrice]);

    const handlePurchase = async (id: string) => {
        try {
            await client.post(`/sweets/${id}/purchase`, { qty: 1 });
            toast.success('Sweet purchased!');
            fetchSweets();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Purchase failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await client.delete(`/sweets/${id}`);
            toast.success('Sweet deleted');
            fetchSweets();
        } catch (err: any) {
            toast.error('Failed to delete');
        }
    };

    const handleRestock = async (id: string) => {
        const qtyStr = window.prompt("Enter quantity to restock:", "10");
        if (!qtyStr) return;
        const qty = parseInt(qtyStr);
        if (isNaN(qty) || qty <= 0) {
            toast.error("Invalid quantity");
            return;
        }

        try {
            await client.post(`/sweets/${id}/restock`, { qty });
            toast.success(`Restocked ${qty} items`);
            fetchSweets();
        } catch (err: any) {
            toast.error('Failed to restock');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity)
            };

            if (editingSweet) {
                await client.put(`/sweets/${editingSweet._id}`, payload);
                toast.success('Sweet updated');
            } else {
                await client.post('/sweets', payload);
                toast.success('Sweet created');
            }
            setShowForm(false);
            setEditingSweet(null);
            setFormData({ name: '', category: '', price: '', quantity: '' });
            fetchSweets();
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Operation failed');
        }
    };

    const startEdit = (sweet: Sweet) => {
        setEditingSweet(sweet);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price.toString(),
            quantity: sweet.quantity.toString()
        });
        setShowForm(true);
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>

            {/* Search Bar */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                    <Search color="#94a3b8" size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search sweets..."
                        className="input-field"
                        style={{ marginBottom: 0, paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{ background: showFilters ? '#a855f7' : '#334155', border: 'none', padding: '0.75rem', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Filter"
                    >
                        <Filter size={20} />
                    </button>

                    {isAdmin && (
                        <button onClick={() => { setShowForm(true); setEditingSweet(null); setFormData({ name: '', category: '', price: '', quantity: '' }) }} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                            + Add New
                        </button>
                    )}
                </div>
            </div>

            {/* Filters Expansion */}
            {showFilters && (
                <div className="glass-panel animate-fade-in" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                    <input type="number" placeholder="Min Price" className="input-field" style={{ marginBottom: 0 }} value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                    <input type="number" placeholder="Max Price" className="input-field" style={{ marginBottom: 0 }} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
            )}

            {/* Admin Form */}
            {showForm && (
                <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #a855f7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                    </div>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input placeholder="Name" className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input placeholder="Category" className="input-field" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input type="number" placeholder="Price" className="input-field" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <input type="number" placeholder="Quantity" className="input-field" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Save Sweet</button>
                    </form>
                </div>
            )}

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {sweets.map(sweet => (
                    <SweetCard
                        key={sweet._id}
                        sweet={sweet}
                        onPurchase={handlePurchase}
                        onDelete={handleDelete}
                        onRestock={handleRestock}
                        onEdit={startEdit}
                    />
                ))}
            </div>

            {sweets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No sweets found. {isAdmin && "Try adding one!"}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
