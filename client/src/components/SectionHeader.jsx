import React, { useEffect, useRef, useState } from 'react';

const SectionHeader = ({ Icon, title, subtitle }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="max-w-4xl mx-auto text-center mb-8" ref={ref}>
            <h2 className="section-heading flex items-center justify-center gap-3">
                {Icon && <Icon className="text-brand w-6 h-6" aria-hidden="true" />}
                <span>{title}</span>
            </h2>
            <div className={`section-accent ${visible ? 'accent-in' : ''}`} />
            {subtitle && <p className="text-gray-600 mt-4">{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
