import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProjectsSection from '../components/ProjectsSection';
import ClientsSection from '../components/ClientsSection';
import ContactForm from '../components/ContactForm';
import Newsletter from '../components/Newsletter';

const Footer = () => (
    <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>&copy; 2026 The Honest Company. All rights reserved.</p>
    </footer>
);

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <HeroSection />
            <ProjectsSection />
            <ClientsSection />
            <ContactForm />
            <Newsletter />
            <Footer />
        </div>
    );
};

export default LandingPage;
