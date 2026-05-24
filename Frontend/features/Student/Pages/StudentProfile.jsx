import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Auth/Pages/Navbar';
import useStudent from '../Hooks/useStudent';

function StudentProfile() {
  const navigate = useNavigate();
  const { loading, error, setError, getStudentProfile, updateBasicProfile, updateStudentProfile, addPortfolioItem, getPortfolioItems, featurePortfolioItem, deletePortfolioItem } = useStudent();
  const [studentId, setStudentId] = useState('');
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', location: '', bio: '', collegeName: '', skills: '', tools: '' });
  const [portfolioForm, setPortfolioForm] = useState({ title: '', category: 'Project', description: '' });

  const refreshProfile = async () => {
    const response = await getStudentProfile();
    const currentUser = response?.user || null;
    const currentProfile = response?.profile || null;

    setProfile(response);
    setStudentId(currentUser?._id || currentUser?.id || '');
    setProfileForm({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      location: typeof currentUser?.location === 'string' ? currentUser.location : currentUser?.location?.city || '',
      bio: currentProfile?.bio || '',
      collegeName: currentProfile?.collegeName || '',
      skills: Array.isArray(currentProfile?.skills) ? currentProfile.skills.join(', ') : '',
      tools: Array.isArray(currentProfile?.tools) ? currentProfile.tools.join(', ') : '',
    });
  };

  const refreshPortfolio = async (userId = studentId) => {
    if (!userId) return;

    const response = await getPortfolioItems(userId, undefined);
    const portfolioItems = response?.portfolio || response?.items || response?.portfolioItems || response?.data || response || [];
    setPortfolio(Array.isArray(portfolioItems) ? portfolioItems : []);
  };

  useEffect(() => {
    refreshProfile().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!studentId) return;
    refreshPortfolio(studentId).catch(() => undefined);
  }, [studentId]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    await updateBasicProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      location: profileForm.location,
    });
    await updateStudentProfile({
      bio: profileForm.bio,
      collegeName: profileForm.collegeName,
      skills: profileForm.skills.split(',').map((item) => item.trim()).filter(Boolean),
      tools: profileForm.tools.split(',').map((item) => item.trim()).filter(Boolean),
    });
    await refreshProfile();
  };

  const handlePortfolioSave = async (event) => {
    event.preventDefault();
    await addPortfolioItem({
      title: portfolioForm.title,
      description: portfolioForm.description,
      category: portfolioForm.category,
    });
    setPortfolioForm({ title: '', category: 'Project', description: '' });
    await refreshPortfolio();
  };

  const handlePortfolioAction = async (item, action) => {
    const itemId = item?._id || item?.id;
    if (!itemId) return;

    if (action === 'feature') await featurePortfolioItem(itemId);

    if (action === 'delete') {
      if (item?.proofType === 'clientApproved') {
        setError('Verified client work cannot be deleted.');
        return;
      }
      await deletePortfolioItem(itemId);
    }

    await refreshPortfolio();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-white bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] p-8 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-800">Student profile</p>
          <h1 className="mt-2 text-3xl font-black tracking-tighter sm:text-4xl">Edit your profile and portfolio</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium text-slate-700">
            Keep your contact details, bio, and proof of work updated from one dedicated page.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleProfileSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Profile</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Student information</h2>
            <div className="mt-4 grid gap-3">
              <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Name" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input value={profileForm.collegeName} onChange={(e) => setProfileForm({ ...profileForm, collegeName: e.target.value })} placeholder="College name" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} placeholder="Skills comma separated" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input value={profileForm.tools} onChange={(e) => setProfileForm({ ...profileForm, tools: e.target.value })} placeholder="Tools comma separated" className="rounded-xl border border-slate-200 px-4 py-3" />
              <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Bio" className="min-h-28 rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <button disabled={loading} className="mt-4 rounded-2xl bg-[#9c27b0] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
              {loading ? 'Updating...' : 'Save profile'}
            </button>
          </form>

          <div className="space-y-6">
            <form onSubmit={handlePortfolioSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Portfolio</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Add proof of work</h2>
              <div className="mt-4 grid gap-3">
                <input value={portfolioForm.title} onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })} placeholder="Title" className="rounded-xl border border-slate-200 px-4 py-3" />
                <input value={portfolioForm.category} onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })} placeholder="Category" className="rounded-xl border border-slate-200 px-4 py-3" />
                <textarea value={portfolioForm.description} onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })} placeholder="Description" className="min-h-28 rounded-xl border border-slate-200 px-4 py-3" />
              </div>
              <button disabled={loading} className="mt-4 rounded-2xl bg-[#0070f3] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                {loading ? 'Saving...' : 'Add portfolio item'}
              </button>
            </form>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Portfolio items</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {portfolio.map((item) => (
                  <article key={item._id || item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-bold text-slate-950">{item.title || 'Portfolio item'}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.description || 'No description available.'}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      <span className="rounded-full bg-white px-2 py-1">{item.category || 'General'}</span>
                      <span className="rounded-full bg-white px-2 py-1">{item.featured ? 'Featured' : 'Not featured'}</span>
                      {item.proofType === 'clientApproved' ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Verified client work</span> : null}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => handlePortfolioAction(item, 'feature')} className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white">Feature</button>
                      {item.proofType !== 'clientApproved' ? (
                        <button onClick={() => handlePortfolioAction(item, 'delete')} className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white">Delete</button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {profile ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-600">
                Loaded profile for <span className="font-bold text-slate-950">{profile?.user?.name || profile?.profile?.collegeName || 'student'}</span>
              </div>
            ) : null}

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentProfile;
