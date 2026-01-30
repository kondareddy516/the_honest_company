import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('23BQ5A0516');
    const [error, setError] = useState('');
    const popoverRef = useRef(null);
    const adminButtonRef = useRef(null);
    const navigate = useNavigate();

    // Close popover on outside click
    React.useEffect(() => {
        const onDocClick = (e) => {
            if (!open) return;
            if (popoverRef.current && !popoverRef.current.contains(e.target) && adminButtonRef.current && !adminButtonRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open]);

    return (
        <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-heading font-bold text-brand">The Honest Company</Link>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    <a href="#projects" className="text-gray-700 hover:text-brand transition">Our Projects</a>
                    <a href="#clients" className="text-gray-700 hover:text-brand transition">Happy Clients</a>
                    <a href="#contact" className="text-gray-700 hover:text-brand transition">Contact</a>
                    <div className="relative">
                        <button ref={adminButtonRef} onClick={() => setOpen(prev => !prev)} className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark transition">Admin</button>
                        {open && (
                            <div ref={popoverRef} className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-4 z-50 left-3 sm:left-auto sm:right-0 sm:w-72 right-3">
                                <h4 className="font-semibold mb-2">Admin Login</h4>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await login(username, password);
                                        setOpen(false);
                                        navigate('/admin');
                                    } catch (err) {
                                        setError(err.response?.data?.message || 'Login failed');
                                    }
                                }}>
                                    <label className="block text-sm text-gray-600">Username</label>
                                    <input value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 rounded border mt-1" />
                                    <label className="block text-sm text-gray-600 mt-2">Password</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded border mt-1" />
                                    {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
                                    <div className="mt-3 flex justify-end">
                                        <button type="submit" className="px-3 py-2 bg-brand text-white rounded">Login</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <MobileMenu />
                </div>
            </div>
        </nav>
    );
};

const MobileMenu = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)} className="p-2 rounded-md bg-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-3">
                    <a href="#projects" className="block py-2 text-gray-700 hover:text-brand">Our Projects</a>
                    <a href="#clients" className="block py-2 text-gray-700 hover:text-brand">Happy Clients</a>
                    <a href="#contact" className="block py-2 text-gray-700 hover:text-brand">Contact</a>
                    <button onClick={async () => {
                        // prompt-based login flow for mobile
                        try {
                            const u = prompt('Admin username', 'admin');
                            if (!u) return;
                            const p = prompt('Admin password', 'admin');
                            if (!p) return;
                            await login(u, p);
                            window.location.href = '/admin';
                        } catch (err) {
                            alert(err.response?.data?.message || 'Login failed');
                        }
                    }} className="block mt-2 px-3 py-2 bg-brand text-white rounded-md text-center">Admin</button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
