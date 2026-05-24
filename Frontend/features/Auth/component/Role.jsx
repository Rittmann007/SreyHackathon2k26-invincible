import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

function Role({ children, allowedRoles = [] }) {
	const { loading, user } = useAuth();

	if (loading) {
		return (
			<div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] px-4 text-slate-900'>
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]' />

				<div className='relative z-10 w-full max-w-md rounded-[28px] border border-white/70 bg-white/30 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150'>
					<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/30 shadow-inner'>
						<div className='h-10 w-10 animate-spin rounded-full border-4 border-[#0070f3] border-t-transparent' />
					</div>

					<h2 className='mt-5 text-2xl font-black tracking-[-0.04em] text-slate-950'>Loading your workspace</h2>
				</div>
			</div>
		);
	}

	const currentUser = user?.user;
	const currentRole = currentUser?.role;
	const isVerified = currentUser?.verified;

	if (!currentUser || !isVerified) {
		return <Navigate to='/login' replace />;
	}

	if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
		return <Navigate to='/' replace />;
	}

	return children;
}

export default Role;
