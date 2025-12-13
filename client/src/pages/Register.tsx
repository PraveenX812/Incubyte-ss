import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'CUSTOMER'
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await client.post('/auth/register', formData);
            login(res.data.token);
            toast.success('Account created!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>I want to be a:</label>
                        <select
                            className="input-field"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Shop Owner (Admin)</option>
                        </select>
                        <small style={{ color: '#64748b' }}>*For testing assignment purposes only</small>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign Up
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                    Already have an account? <Link to="/login" style={{ color: '#a855f7' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
