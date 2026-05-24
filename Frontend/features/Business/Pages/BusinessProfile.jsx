import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Auth/Pages/Navbar';
import useBusiness from '../Hooks/useBusiness';

function BusinessProfile() {
  const navigate = useNavigate();
  const { loading, error, getBusinessProfile, updateBasicProfile, updateBusinessProfile } = useBusiness();
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    location: '',
    businessName: '',
    businessType: '',
    description: '',
    website: '',
  });

  const refreshProfile = async () => {
    const response = await getBusinessProfile();
    const profileData = response?.profile || null;
    const userData = response?.user || null;

    setProfileForm({
      name: userData?.name || '',
      phone: userData?.phone || '',
      location: typeof userData?.location === 'string'
        ? userData.location
        : userData?.location?.city || '',
      businessName: profileData?.businessName || '',
      businessType: profileData?.businessType || '',
      description: profileData?.description || '',
      website: profileData?.website || '',
    });
  };

  useEffect(() => {
    refreshProfile().catch(() => undefined);
  }, []);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    await updateBasicProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      location: profileForm.location,
    });
    await updateBusinessProfile({
      businessName: profileForm.businessName,
      businessType: profileForm.businessType,
      description: profileForm.description,
      website: profileForm.website,
    });
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-white bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] p-8 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-800">Business profile</p>
          <h1 className="mt-2 text-3xl font-black tracking-tighter sm:text-4xl">Edit your business details</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium text-slate-700">
            Keep your contact details and public business information up to date.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/business/dashboard" className="rounded-2xl border border-slate-950/10 bg-white/40 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-white/65">
              Dashboard
            </Link>
            <Link to="/business/tasks" className="rounded-2xl border border-slate-950/10 bg-white/40 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-white/65">
              Tasks
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Profile editor</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Business information</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/business/dashboard')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Back to dashboard
            </button>
          </div>

          <form onSubmit={handleProfileSave} className="mt-6 grid gap-3">
            <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Name" className="rounded-xl border border-slate-200 px-4 py-3" />
            <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-slate-200 px-4 py-3" />
            <input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3" />
            <input value={profileForm.businessName} onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })} placeholder="Business name" className="rounded-xl border border-slate-200 px-4 py-3" />
            <input value={profileForm.businessType} onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })} placeholder="Business type" className="rounded-xl border border-slate-200 px-4 py-3" />
            <input value={profileForm.website} onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })} placeholder="Website" className="rounded-xl border border-slate-200 px-4 py-3" />
            <textarea value={profileForm.description} onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })} placeholder="Description" className="min-h-28 rounded-xl border border-slate-200 px-4 py-3" />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button disabled={loading} className="rounded-2xl bg-[#9c27b0] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                {loading ? 'Updating...' : 'Save profile'}
              </button>
              {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default BusinessProfile;