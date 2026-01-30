import React, { useState } from 'react';
import { submitContact } from '../api';
import { FiMail } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionReveal from './SectionReveal';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        city: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitContact(formData);
            setStatus('Thank you! We will contact you soon.');
            setFormData({ fullName: '', email: '', mobile: '', city: '' });
        } catch (err) {
            setStatus('Something went wrong. Please try again.');
        }
    };

        return (
            <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-gray-95 to-white scroll-mt-24">
            <div className="container mx-auto px-4">
                <SectionReveal>
                    <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                            {/* Left header */}
                            <div className="md:col-span-5 flex flex-col items-start justify-center p-8 bg-gray-50 rounded-2xl">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 text-brand mb-4">
                                    <FiMail className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-semibold">Get in touch</h3>
                                <p className="text-gray-600 mt-2">We'd love to hear about your project. Tell us a bit and we'll get back to you.</p>
                                <div className="section-accent mt-6" />
                            </div>

                            {/* Right form */}
                            <form onSubmit={handleSubmit} className="md:col-span-7 p-1 md:p-0">
                                <div className="space-y-4">
                                    {status && <p className="text-center text-green-600 font-semibold">{status}</p>}
                                    <div>
                                        <label className="block text-gray-700 mb-2">Full Name</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-2">Mobile Number</label>
                                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-2">City</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="px-6 py-3 bg-brand text-white rounded-full hover:opacity-95 transition">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
};

export default ContactForm;
