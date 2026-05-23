import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

function Navbar() {
  const navigate = useNavigate();
  const { user, handlelogout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentUser = user?.user;
  const profile = user?.profile;
  const role = currentUser?.role;
  const isVerified = currentUser?.verified;

  const handleDashboard = () => {
    setOpen(false);
    navigate('/dashbord');
  };

  const handleLogout = async () => {
    setOpen(false);
    await handlelogout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_55%,#74b9ff_100%)] shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-950 transition hover:opacity-90">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/35 shadow-sm backdrop-blur-md">
            <span className="text-2xl">🐝</span>
          </span>
          <div className="leading-tight">
            <h1 className="text-2xl font-black tracking-tighter sm:text-[2.1rem]">TaskHive</h1>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
          {!currentUser ? (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-950/10 bg-white/35 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-white/50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-[#0070f3] px-4 py-2 text-sm font-bold text-white shadow-[0_18px_30px_rgba(0,112,243,0.22)] transition hover:bg-[#0063db]"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/60 bg-white/30 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm backdrop-blur-md transition hover:bg-white/45"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0070f3] text-xs font-black text-white shadow-[0_10px_20px_rgba(0,112,243,0.25)]">
                  {role === 'business' ? 'B' : 'S'}
                </span>
                <span className="uppercase tracking-[0.18em]">{role || 'User'}</span>
                <span className={`text-xs transition ${open ? 'rotate-180' : 'rotate-0'}`}>⌄</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-75 overflow-hidden rounded-3xl border border-white/70 bg-white/35 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150">
                  <div className="border-b border-white/50 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-600">Profile details</p>
                    <div className="mt-3 space-y-1 text-sm text-slate-900">
                      <p className="font-black text-base">{currentUser?.name}</p>
                      <p className="text-slate-700">{currentUser?.email}</p>
                      <p className="font-semibold text-slate-700">
                        Role: <span className="text-slate-950">{role}</span>
                      </p>
                      <p className="font-semibold text-slate-700">
                        Status: <span className={isVerified ? 'text-emerald-700' : 'text-rose-700'}>
                          {isVerified ? 'Verified' : 'Pending verification'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-white/50 px-4 py-4 text-sm text-slate-800">
                    {profile ? (
                      role === 'business' ? (
                        <div className="space-y-2">
                          <p className="font-bold text-slate-950">Business profile</p>
                          <p><span className="font-semibold">Name:</span> {profile.businessName || '-'}</p>
                          <p><span className="font-semibold">Type:</span> {profile.businessType || '-'}</p>
                          <p><span className="font-semibold">Website:</span> {profile.website || '-'}</p>
                          <p><span className="font-semibold">Location:</span> {profile.location || '-'}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-bold text-slate-950">Student profile</p>
                          <p><span className="font-semibold">College:</span> {profile.collegeName || '-'}</p>
                          <p><span className="font-semibold">Trust tier:</span> {profile.trustTier || '-'}</p>
                          <p><span className="font-semibold">Skills:</span> {(profile.skills || []).join(', ') || '-'}</p>
                        </div>
                      )
                    ) : (
                      <p className="text-slate-700">Profile details unavailable.</p>
                    )}
                  </div>

                  <div className="grid gap-2 p-4">
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="rounded-2xl bg-[#0070f3] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(0,112,243,0.22)] transition hover:bg-[#0063db]"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loading}
                      className="rounded-2xl bg-[#9c27b0] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(156,39,176,0.22)] transition hover:bg-[#8a209d] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;