import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../api';
import { FiBriefcase } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import SectionReveal from './SectionReveal';

const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects().then(res => setProjects(res.data)).catch(err => console.error(err));
    }, []);

    const featured = projects && projects.length ? projects[0] : null;
    const others = projects && projects.length > 1 ? projects.slice(1) : [];
    const INITIAL_VISIBLE = 4;
    const [visible, setVisible] = useState(INITIAL_VISIBLE);
    const othersVisibleCount = Math.max(0, visible - (featured ? 1 : 0));
    const displayedOthers = others.slice(0, othersVisibleCount);
    const noFeaturedDisplayed = !featured ? projects.slice(0, visible) : [];

    return (
        <section id="projects" className="py-20 md:py-28 bg-white scroll-mt-20">
            <div className="container mx-auto px-4">
                <SectionHeader Icon={FiBriefcase} title="Our Projects" subtitle="Selected case studies and recent work — crafted with care." />

                {/* Featured project */}
                {featured && (
                    <SectionReveal>
                        <div className="max-w-5xl mx-auto rounded-3xl shadow-xl overflow-hidden mb-10">
                            <article className="group relative">
                                <div className="relative">
                                    <img src={featured.image || "https://via.placeholder.com/1200x700"} alt={featured.name} className="w-full h-72 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                                    <div className="absolute left-6 bottom-6 text-white">
                                        <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm">{featured.type || 'Web'}</div>
                                        <h3 className="mt-3 text-2xl md:text-4xl font-semibold">{featured.name}</h3>
                                        <p className="mt-2 max-w-xl text-sm md:text-base text-white/90">{featured.description ? (featured.description.length > 180 ? featured.description.slice(0, 180) + '...' : featured.description) : ''}</p>
                                        <div className="mt-4">
                                            <a href={`/projects/${featured._id}`} className="inline-block px-5 py-3 bg-white text-brand font-semibold rounded-full shadow hover:opacity-95 transition">View Case Study</a>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </SectionReveal>
                )}

                {/* Grid of other projects */}
                <SectionReveal>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featured ? (
                            displayedOthers.map((project) => (
                                <article key={project._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition">
                                    <div className="relative">
                                        <img src={project.image || "https://via.placeholder.com/800x600"} alt={project.name} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute left-4 top-4 bg-white/90 text-sm text-gray-800 px-3 py-1 rounded-full">{project.type || 'Web'}</div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                                        <p className="text-gray-600 mb-4 text-sm">{project.description ? (project.description.length > 120 ? project.description.slice(0, 120) + '...' : project.description) : ''}</p>
                                        <div className="flex items-center justify-end">
                                            <a href={`/projects/${project._id}`} className="text-sm text-brand font-semibold">View →</a>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            noFeaturedDisplayed.map((project) => (
                                <article key={project._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition">
                                    <div className="relative">
                                        <img src={project.image || "https://via.placeholder.com/800x600"} alt={project.name} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute left-4 top-4 bg-white/90 text-sm text-gray-800 px-3 py-1 rounded-full">{project.type || 'Web'}</div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                                        <p className="text-gray-600 mb-4 text-sm">{project.description ? (project.description.length > 120 ? project.description.slice(0, 120) + '...' : project.description) : ''}</p>
                                        <div className="flex items-center justify-end">
                                            <a href={`/projects/${project._id}`} className="text-sm text-brand font-semibold">View →</a>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </SectionReveal>

                {/* View more button */}
                {projects.length > visible && (
                    <div className="mt-8 text-center">
                        <button onClick={() => setVisible(v => v + 3)} className="px-6 py-3 bg-brand text-white rounded-full hover:opacity-95 transition">View more</button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectsSection;
