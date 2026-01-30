import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProject, createClient, fetchContacts, fetchSubscribers, fetchProjects, fetchClients, deleteProject, updateProject, deleteClient, updateClient, logout } from '../api';
import { ImageCropper, getCroppedImg } from '../components/ImageCropper';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiGrid, FiUsers, FiMail, FiInbox } from 'react-icons/fi';
import heroPlaceholder from '../assets/hero-placeholder.svg';

// Helper to show truncated text with an expand/collapse button in admin tables
const TruncatedText = ({ text, limit = 100 }) => {
    const [expanded, setExpanded] = useState(false);
    if (!text) return <span className="text-sm text-gray-500">-</span>;
    if (text.length <= limit) return <span className="text-sm text-gray-500">{text}</span>;
    return (
        <span className="text-sm text-gray-500">
            {expanded ? text : `${text.slice(0, limit)}...`}
            <button onClick={() => setExpanded(!expanded)} className="ml-2 text-indigo-600 hover:underline">
                {expanded ? 'Show less' : 'Show more'}
            </button>
        </span>
    );
};

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('projects');
    
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
                <div className="p-6 text-2xl font-bold border-b border-gray-800 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-brand font-bold">F</div>
                    <div>Admin Panel</div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg ${activeTab === 'projects' ? 'bg-white/5 text-brand' : 'hover:bg-white/3'}`}>
                        <FiGrid className="w-5 h-5" /> <span className="font-medium">Projects</span>
                    </button>
                    <button onClick={() => setActiveTab('clients')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg ${activeTab === 'clients' ? 'bg-white/5 text-brand' : 'hover:bg-white/3'}`}>
                        <FiUsers className="w-5 h-5" /> <span className="font-medium">Clients</span>
                    </button>
                    <button onClick={() => setActiveTab('contacts')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg ${activeTab === 'contacts' ? 'bg-white/5 text-brand' : 'hover:bg-white/3'}`}>
                        <FiMail className="w-5 h-5" /> <span className="font-medium">Contacts</span>
                    </button>
                    <button onClick={() => setActiveTab('subscribers')} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg ${activeTab === 'subscribers' ? 'bg-white/5 text-brand' : 'hover:bg-white/3'}`}>
                        <FiInbox className="w-5 h-5" /> <span className="font-medium">Subscribers</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <LogoutButton className="w-full text-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'projects' && <ProjectManager />}
                {activeTab === 'clients' && <ClientManager />}
                {activeTab === 'contacts' && <ContactViewer />}
                {activeTab === 'subscribers' && <SubscriberViewer />}
            </div>
        </div>
    );
};

// --- Sub Components ---

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingId, setEditingId] = useState(null);
        const [projectSearch, setProjectSearch] = useState('');
        const [projectSortBy, setProjectSortBy] = useState('name');
        const [projectSortDir, setProjectSortDir] = useState('asc');
    
    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedPixels, setCroppedPixels] = useState(null);
    const [projectErrors, setProjectErrors] = useState({});

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await fetchProjects();
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.addEventListener('load', () => setImageSrc(reader.result));
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setImageSrc(null);
        setCroppedPixels(null);
        setEditingId(null);
        setShowAddForm(false);
        setProjectErrors({});
    };

    const handleEditClick = (project) => {
        setName(project.name);
        setDescription(project.description);
        setEditingId(project._id);
        setShowAddForm(true);
        setImageSrc(null); // Reset image unless they upload a new one
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                loadProjects();
            } catch (err) {
                console.error(err);
                alert('Failed to delete project');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateProjectForm()) return;
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            
            if (imageSrc && croppedPixels) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedPixels);
                formData.append('image', croppedImageBlob, 'project.jpg');
            }

            if (editingId) {
                await updateProject(editingId, formData);
                alert('Project updated successfully!');
            } else {
                await createProject(formData);
                alert('Project added successfully!');
            }
            
            resetForm();
            loadProjects();
        } catch (err) {
            console.error(err);
            alert('Failed to save project');
        }
    };

    const validateProjectForm = () => {
        const errs = {};
        if (!name || !name.trim()) errs.name = 'Project name is required';
        if (!description || description.trim().length < 10) errs.description = 'Description should be at least 10 characters';
        setProjectErrors(errs);
        return Object.keys(errs).length === 0;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Projects</h2>
                    <p className="text-sm text-gray-500">Manage projects, images and case studies</p>
                </div>
                <div className="flex items-center gap-3">
                    <input value={projectSearch} onChange={e => setProjectSearch(e.target.value)} placeholder="Search projects" className="px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                    <select value={projectSortBy} onChange={e => setProjectSortBy(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200">
                        <option value="name">Sort: Name</option>
                    </select>
                    <button onClick={() => setProjectSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="px-3 py-2 rounded-lg border border-gray-200">{projectSortDir === 'asc' ? '↑' : '↓'}</button>
                    <button onClick={() => { resetForm(); setShowAddForm(true); }} className="bg-brand text-white px-4 py-2 rounded-full hover:opacity-95 flex items-center gap-2 shadow">
                        <FiPlus /> <span>Add Project</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                            const q = projectSearch.trim().toLowerCase();
                            let list = projects.slice();
                            if (q) list = list.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)));
                            // sorting
                            list.sort((a, b) => {
                                const na = (a.name || '').toLowerCase();
                                const nb = (b.name || '').toLowerCase();
                                if (na < nb) return projectSortDir === 'asc' ? -1 : 1;
                                if (na > nb) return projectSortDir === 'asc' ? 1 : -1;
                                return 0;
                            });
                            return list.map((project) => (
                                <tr key={project._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-4">
                                        <img src={project.image || heroPlaceholder} alt={project.name} className="w-20 h-12 rounded object-cover" />
                                        <div>
                                            <div className="font-semibold">{project.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500"><TruncatedText text={project.description} limit={120} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => setSelectedProject(project)} className="p-2 rounded hover:bg-gray-100 text-indigo-600" title="Preview">
                                            <FiEye size={18} />
                                        </button>
                                        <button onClick={() => handleEditClick(project)} className="p-2 rounded hover:bg-gray-100 text-yellow-600" title="Edit">
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(project._id)} className="p-2 rounded hover:bg-gray-100 text-red-600" title="Delete">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup for Add/Edit Form */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                            <button onClick={resetForm} className="text-gray-600 hover:text-gray-900">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Project Name</label>
                                <input type="text" value={name} onChange={e => { setName(e.target.value); setProjectErrors(pe => ({...pe, name: ''})); }} required className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand ${projectErrors.name ? 'border-red-500' : 'border border-gray-200'}`} aria-invalid={!!projectErrors.name} />
                                {projectErrors.name && <p className="mt-1 text-xs text-red-600">{projectErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Description</label>
                                <textarea value={description} onChange={e => { setDescription(e.target.value); setProjectErrors(pe => ({...pe, description: ''})); }} onBlur={validateProjectForm} required className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand ${projectErrors.description ? 'border-red-500' : 'border border-gray-200'}`} rows="4"></textarea>
                                {projectErrors.description && <p className="mt-1 text-xs text-red-600">{projectErrors.description}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Image {editingId && '(Leave empty to keep existing)'}</label>
                                <input type="file" accept="image/*" onChange={onFileChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm" />
                                {imageSrc && (
                                    <div className="mt-2">
                                         <p className="text-sm text-gray-500 mb-2">Crop Image (450x350 ratio)</p>
                                        <ImageCropper imageSrc={imageSrc} onCropComplete={setCroppedPixels} aspectRatio={450/350} />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-800 px-4 py-2 sm:px-6 sm:py-2 rounded hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={!validateProjectForm()} className={`px-4 py-2 sm:px-6 sm:py-2 rounded ${validateProjectForm() ? 'bg-brand text-white hover:opacity-95' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>{editingId ? 'Update' : 'Add'} Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* Modal Popup for Preview */}
             {selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                            <button onClick={() => setSelectedProject(null)} className="text-gray-600 hover:text-gray-900">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <div className="mb-4">
                            <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-auto rounded object-cover" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Description</h3>
                            <p className="text-gray-700">{selectedProject.description}</p>
                        </div>
                         <div className="flex justify-end mt-4">
                            <button onClick={() => setSelectedProject(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [editingId, setEditingId] = useState(null);
        const [clientSearch, setClientSearch] = useState('');
        const [clientSortBy, setClientSortBy] = useState('name');
        const [clientSortDir, setClientSortDir] = useState('asc');

    // Form State
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [description, setDescription] = useState('');
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedPixels, setCroppedPixels] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const res = await fetchClients();
            setClients(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.addEventListener('load', () => setImageSrc(reader.result));
        }
    };

    const resetForm = () => {
        setName('');
        setDesignation('');
        setDescription('');
        setImageSrc(null);
        setCroppedPixels(null);
        setEditingId(null);
        setShowAddForm(false);
        setClientErrors({});
    };

    const handleEditClick = (client) => {
        setName(client.name);
        setDesignation(client.designation);
        setDescription(client.description);
        setEditingId(client._id);
        setShowAddForm(true);
        setImageSrc(null);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await deleteClient(id);
                loadClients();
            } catch (err) {
                console.error(err);
                alert('Failed to delete client');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateClientForm()) return;
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('designation', designation);
            formData.append('description', description);
            
            if (imageSrc && croppedPixels) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedPixels);
                formData.append('image', croppedImageBlob, 'client.jpg');
            }

            if (editingId) {
                await updateClient(editingId, formData);
                alert('Client updated successfully!');
            } else {
                await createClient(formData);
                alert('Client added successfully!');
            }
            resetForm();
            loadClients();
        } catch (err) {
            console.error(err);
            alert('Failed to save client');
        }
    };

    const validateClientForm = () => {
        const errs = {};
        if (!name || !name.trim()) errs.name = 'Client name is required';
        if (!designation || !designation.trim()) errs.designation = 'Designation is required';
        if (!description || description.trim().length < 10) errs.description = 'Testimonial should be at least 10 characters';
        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg relative mt-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Clients</h2>
                    <p className="text-sm text-gray-500">Manage client testimonials and contacts</p>
                </div>
                <div className="flex items-center gap-3">
                    <input value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Search clients" className="px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                    <select value={clientSortBy} onChange={e => setClientSortBy(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200">
                        <option value="name">Sort: Name</option>
                    </select>
                    <button onClick={() => setClientSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="px-3 py-2 rounded-lg border border-gray-200">{clientSortDir === 'asc' ? '↑' : '↓'}</button>
                    <button onClick={() => { resetForm(); setShowAddForm(true); }} className="bg-brand text-white px-4 py-2 rounded-full hover:opacity-95 flex items-center gap-2 shadow">
                        <FiPlus /> <span>Add Client</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Testimonial</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                            const q = clientSearch.trim().toLowerCase();
                            let list = clients.slice();
                            if (q) list = list.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.description && c.description.toLowerCase().includes(q)));
                            list.sort((a, b) => {
                                const na = (a.name || '').toLowerCase();
                                const nb = (b.name || '').toLowerCase();
                                if (na < nb) return clientSortDir === 'asc' ? -1 : 1;
                                if (na > nb) return clientSortDir === 'asc' ? 1 : -1;
                                return 0;
                            });
                            return list.map((client) => (
                                <tr key={client._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-4">
                                        <img src={client.image || heroPlaceholder} alt={client.name} className="w-14 h-14 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold">{client.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.designation}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500"><TruncatedText text={client.description} limit={120} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => setSelectedClient(client)} className="p-2 rounded hover:bg-gray-100 text-indigo-600" title="Preview">
                                            <FiEye size={18} />
                                        </button>
                                        <button onClick={() => handleEditClick(client)} className="p-2 rounded hover:bg-gray-100 text-yellow-600" title="Edit">
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(client._id)} className="p-2 rounded hover:bg-gray-100 text-red-600" title="Delete">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup for Add/Edit Form */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-2xl">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{editingId ? 'Edit Client' : 'Add New Client'}</h2>
                            <button onClick={resetForm} className="text-gray-600 hover:text-gray-900">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Client Name</label>
                                <input type="text" value={name} onChange={e => { setName(e.target.value); setClientErrors(ce => ({...ce, name: ''})); }} required className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand ${clientErrors.name ? 'border-red-500' : 'border border-gray-200'}`} aria-invalid={!!clientErrors.name} />
                                {clientErrors.name && <p className="mt-1 text-xs text-red-600">{clientErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Designation</label>
                                <input type="text" value={designation} onChange={e => { setDesignation(e.target.value); setClientErrors(ce => ({...ce, designation: ''})); }} required className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand ${clientErrors.designation ? 'border-red-500' : 'border border-gray-200'}`} aria-invalid={!!clientErrors.designation} />
                                {clientErrors.designation && <p className="mt-1 text-xs text-red-600">{clientErrors.designation}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Testimonial/Description</label>
                                <textarea value={description} onChange={e => { setDescription(e.target.value); setClientErrors(ce => ({...ce, description: ''})); }} onBlur={validateClientForm} required className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand ${clientErrors.description ? 'border-red-500' : 'border border-gray-200'}`} rows="4"></textarea>
                                {clientErrors.description && <p className="mt-1 text-xs text-red-600">{clientErrors.description}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Image {editingId && '(Leave empty to keep existing)'}</label>
                                <input type="file" accept="image/*" onChange={onFileChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 shadow-sm" />
                                 {imageSrc && (
                                    <div className="mt-2">
                                         <p className="text-sm text-gray-500 mb-2">Crop Image (1:1 ratio)</p>
                                        <ImageCropper imageSrc={imageSrc} onCropComplete={setCroppedPixels} aspectRatio={1} />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-800 px-4 py-2 sm:px-6 sm:py-2 rounded hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={!validateClientForm()} className={`px-4 py-2 sm:px-6 sm:py-2 rounded ${validateClientForm() ? 'bg-brand text-white hover:opacity-95' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>{editingId ? 'Update' : 'Add'} Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Popup for Preview */}
            {selectedClient && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                            <button onClick={() => setSelectedClient(null)} className="text-gray-600 hover:text-gray-900">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <div className="mb-4 text-center">
                            <img src={selectedClient.image} alt={selectedClient.name} className="w-32 h-32 rounded-full object-cover mx-auto" />
                        </div>
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{selectedClient.designation}</h3>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Testimonial/Description</h3>
                            <p className="text-gray-700 italic">"{selectedClient.description}"</p>
                        </div>
                         <div className="flex justify-end mt-4">
                            <button onClick={() => setSelectedClient(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ContactViewer = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetchContacts().then(res => setContacts(res.data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Contact Responses</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contacts.map((contact) => (
                            <tr key={contact._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contact.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.mobile}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.city}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SubscriberViewer = () => {
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        fetchSubscribers().then(res => setSubscribers(res.data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white p-6 rounded shadow max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Newsletter Subscribers</h2>
            <ul className="divide-y divide-gray-200">
                {subscribers.map((sub) => (
                    <li key={sub._id} className="py-4 flex justify-between">
                        <span className="text-gray-900">{sub.email}</span>
                        <span className="text-gray-500 text-sm">{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const LogoutButton = ({ className }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (err) {
            // ignore
        }
        setLoading(false);
        navigate('/');
    };
    const btnClass = className || 'px-4 py-2 bg-gray-100 rounded hover:bg-gray-200';
    return (
        <button onClick={handleLogout} className={btnClass} disabled={loading}>
            {loading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default AdminPanel;
