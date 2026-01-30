import React from 'react';
import heroImg from '../assets/hero-placeholder.svg';

const HeroSection = () => {
    return (
        <section className="relative bg-gradient-to-r from-brand to-brand-deep text-white py-24 overflow-hidden">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4">We design & build beautiful products</h1>
                    <p className="text-lg md:text-xl mb-8 opacity-90">Crafting digital experiences and scalable apps that help businesses grow faster.</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <button className="px-6 py-3 bg-white text-brand font-semibold rounded-full shadow hover:opacity-95 transition">Get Started</button>
                        <button className="px-6 py-3 bg-white/20 border border-white/30 text-white rounded-full hover:bg-white/30 transition">See Portfolio</button>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-3xl p-6">
                        <img src={heroImg} alt="Hero" className="w-full rounded-lg mb-4" />
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div>
                                <div className="text-2xl font-bold">24+</div>
                                <div className="opacity-80">Projects</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">12</div>
                                <div className="opacity-80">Clients</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4.9</div>
                                <div className="opacity-80">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
