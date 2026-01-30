import React, { useState } from 'react';
import { subscribeNewsletter } from '../api';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await subscribeNewsletter(email);
            setMessage('Subscribed successfully!');
            setEmail('');
        } catch (err) {
            setMessage('Failed to subscribe or already subscribed.');
        }
    };

    return (
        <section className="py-16 bg-gradient-to-r from-brand to-brand-deep text-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
                <p className="mb-8 opacity-90">Stay updated with our latest news and offers.</p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center gap-4 max-w-lg mx-auto">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button type="submit" className="px-6 py-3 bg-white text-brand rounded-full hover:opacity-95 transition">Subscribe</button>
                </form>
                {message && <p className="mt-4 text-sm font-medium">{message}</p>}
            </div>
        </section>
    );
};

export default Newsletter;
