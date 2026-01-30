import React, { useEffect, useRef, useState } from 'react';

const SectionReveal = ({ children, rootMargin = '0px 0px -10% 0px' }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setInView(true);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.05, rootMargin });
        obs.observe(el);
        return () => obs.disconnect();
    }, [rootMargin]);

    // Clone children to inject per-item index variable and a base class
    const kids = React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;
        const existing = child.props.className ? child.props.className + ' reveal-item' : 'reveal-item';
        const style = { ...(child.props.style || {}), '--i': i };
        return React.cloneElement(child, { className: existing, style });
    });

    return (
        <div ref={ref} className={`reveal ${inView ? 'in-view' : ''}`}>
            {kids}
        </div>
    );
};

export default SectionReveal;
