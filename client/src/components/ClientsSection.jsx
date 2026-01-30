import React, { useEffect, useState } from 'react';
import { fetchClients } from '../api';
import logo1 from '../assets/logo-1.svg';
import logo2 from '../assets/logo-2.svg';
import logo3 from '../assets/logo-3.svg';
import { FiUsers } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionReveal from './SectionReveal';

const ClientsSection = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchClients().then(res => setClients(res.data)).catch(err => console.error(err));
    }, []);

    const logos = clients.map(c => c.logo || c.image).filter(Boolean);
    const placeholderLogos = [logo1, logo2, logo3];
    const featured = clients && clients.length ? clients[0] : null;
    const others = clients && clients.length > 1 ? clients.slice(1) : [];
    const INITIAL_VISIBLE_CLIENTS = 4;
    const [visibleClients, setVisibleClients] = useState(INITIAL_VISIBLE_CLIENTS);
    const othersVisibleClients = Math.max(0, visibleClients - (featured ? 1 : 0));
    const displayedOtherClients = others.slice(0, othersVisibleClients);
    const noFeaturedClientsDisplayed = !featured ? clients.slice(0, visibleClients) : [];

    return (
        <section id="clients" className="py-20 md:py-28 bg-gray-100 scroll-mt-20">
            <div className="container mx-auto px-4">
                <SectionHeader Icon={FiUsers} title="Happy Clients" subtitle="Trusted by startups and enterprises worldwide." />

                

                {/* Featured testimonial */}
                {featured && (
                    <SectionReveal>
                        <article className="mb-8 bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                            <div className="md:col-span-4 flex items-center justify-center md:justify-start">
                                <img src={featured.image || "https://via.placeholder.com/200"} alt={featured.name} className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg -mt-12" />
                            </div>
                            <div className="md:col-span-8">
                                <div className="inline-flex items-center gap-3">
                                    <svg className="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M7.17 6.35A5 5 0 0 1 12 4c2.76 0 5 2.24 5 5v.5A2.5 2.5 0 0 1 14.5 12H13v-.5A2.5 2.5 0 0 0 10.5 9H9a2.5 2.5 0 0 0-1.83-2.65zM3 13.5A2.5 2.5 0 0 1 5.5 11H7v.5A2.5 2.5 0 0 0 9.5 14H11v.5A2.5 2.5 0 0 1 8.5 17H5.5A2.5 2.5 0 0 1 3 14.5v-.5z"/></svg>
                                    <h4 className="text-xl font-semibold">{featured.name}</h4>
                                    <div className="text-sm text-gray-500">{featured.designation}</div>
                                </div>
                                <p className="mt-4 text-gray-700 text-lg italic">“{featured.description ? (featured.description.length > 300 ? featured.description.slice(0,300) + '...' : featured.description) : ''}”</p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="text-yellow-400 text-lg">{'★'.repeat(featured.rating || 5)}</div>
                                    <a href="#" className="ml-auto inline-block px-4 py-2 bg-brand text-white rounded-full">See all testimonials</a>
                                </div>
                            </div>
                        </article>
                    </SectionReveal>
                )}

                {/* Other testimonials */}
                <SectionReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featured ? (
                            displayedOtherClients.map((client) => (
                                <figure key={client._id} className="relative bg-white rounded-2xl shadow-lg p-6 overflow-visible border-t-4 border-transparent hover:border-brand transition">
                                    <div className="absolute left-6 -top-6 z-10">
                                        <img src={client.image || "https://via.placeholder.com/150"} alt={client.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow" />
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="text-lg font-semibold">{client.name}</h4>
                                        <div className="text-sm text-gray-500">{client.designation}</div>
                                    </div>
                                    <blockquote className="text-gray-600 italic mt-4">“{client.description ? (client.description.length > 160 ? client.description.slice(0,160) + '...' : client.description) : ''}”</blockquote>
                                    <figcaption className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <span className="text-yellow-400">{'★'.repeat(client.rating || 5)}</span>
                                    </figcaption>
                                </figure>
                            ))
                        ) : (
                            noFeaturedClientsDisplayed.map((client) => (
                                <figure key={client._id} className="relative bg-white rounded-2xl shadow-lg p-6 overflow-visible border-t-4 border-transparent hover:border-brand transition">
                                    <div className="absolute left-6 -top-6 z-10">
                                        <img src={client.image || "https://via.placeholder.com/150"} alt={client.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow" />
                                    </div>
                                    <div className="mt-6">
                                        <h4 className="text-lg font-semibold">{client.name}</h4>
                                        <div className="text-sm text-gray-500">{client.designation}</div>
                                    </div>
                                    <blockquote className="text-gray-600 italic mt-4">“{client.description ? (client.description.length > 160 ? client.description.slice(0,160) + '...' : client.description) : ''}”</blockquote>
                                    <figcaption className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <span className="text-yellow-400">{'★'.repeat(client.rating || 5)}</span>
                                    </figcaption>
                                </figure>
                            ))
                        )}
                    </div>
                </SectionReveal>

                {/* View more button */}
                {clients.length > visibleClients && (
                    <div className="mt-8 text-center">
                        <button onClick={() => setVisibleClients(v => v + 3)} className="px-6 py-3 bg-brand text-white rounded-full hover:opacity-95 transition">View more</button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ClientsSection;
