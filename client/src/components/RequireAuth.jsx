import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyAuth } from '../api';

const RequireAuth = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        let mounted = true;
        verifyAuth().then(() => {
            if (mounted) setAuthed(true);
        }).catch(() => {
            if (mounted) setAuthed(false);
        }).finally(() => {
            if (mounted) setLoading(false);
        });
        return () => { mounted = false };
    }, []);

    if (loading) return null; // or a spinner
    if (!authed) return <Navigate to="/" replace />;
    return children;
};

export default RequireAuth;
