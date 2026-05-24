import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/Hooks/useAuth';

function DashBoard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUser = user?.user;
  const role = currentUser?.role;

  useEffect(() => {
    if (loading) return;
    if (role === 'business') navigate('/business/dashboard', { replace: true });
    if (role === 'student') navigate('/student/dashboard', { replace: true });
  }, [loading, role, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Dashboard router</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">Loading your workspace</h1>
        <p className="mt-3 text-sm text-slate-600">You are being redirected to the correct workspace based on your role.</p>
      </div>
    </div>
  );
}

export default DashBoard;