import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../Auth/Pages/Navbar';
import useStudent from '../Hooks/useStudent';

function StudentDashboard() {
  const location = useLocation();
  const { loading, error, getTasks, createPitch, improvePitch, getMyPitches, getAppliedTasks } = useStudent();
  const [tasks, setTasks] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [appliedTasks, setAppliedTasks] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', minBudget: '', maxBudget: '' });
  const [pitchForm, setPitchForm] = useState({ taskId: '', coverLetter: '', proposedPrice: '', timeline: '', sampleLinks: '' });

  const currentPath = location.pathname;
  const currentView = currentPath === '/student/tasks' ? 'tasks' : 'dashboard';

  const tabClassName = (path) =>
    `rounded-2xl px-4 py-2 text-sm font-bold transition ${
      currentPath === path
        ? 'bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]'
        : 'border border-slate-950/10 bg-white/40 text-slate-950 hover:bg-white/65'
    }`;

  const renderAttachments = (attachments = []) => {
    if (!Array.isArray(attachments) || attachments.length === 0) return null;

    return (
      <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Attached files</p>
        <div className="space-y-2">
          {attachments.map((file, index) => {
            const fileUrl = file?.url || file?.fileUrl || file?.path || '';
            const fileName = file?.name || file?.filename || file?.originalName || `File ${index + 1}`;

            if (!fileUrl) {
              return (
                <div key={`${fileName}-${index}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                  {fileName}
                </div>
              );
            }

            return (
              <div key={`${fileUrl}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="min-w-0 truncate font-medium text-slate-700">{fileName}</span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="shrink-0 rounded-lg bg-[#0070f3] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0063db]"
                >
                  Download
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const refreshTasks = async () => {
    const response = await getTasks(filters);
    const nextTasks = response?.tasks || response?.data || response || [];
    const taskList = Array.isArray(nextTasks) ? nextTasks : [];
    setTasks(taskList);

    if (!pitchForm.taskId && taskList.length) {
      setPitchForm((prev) => ({ ...prev, taskId: taskList[0]._id || taskList[0].id || '' }));
    }
  };

  const refreshMyPitches = async () => {
    const response = await getMyPitches();
    const pitchList = response?.pitches || response?.data || response || [];
    setPitches(Array.isArray(pitchList) ? pitchList : []);
  };

  const refreshAppliedTasks = async () => {
    const response = await getAppliedTasks();
    const appliedList = response?.applied || response?.data || response || [];
    setAppliedTasks(Array.isArray(appliedList) ? appliedList : []);
  };

  useEffect(() => {
    refreshTasks().catch(() => undefined);
    refreshMyPitches().catch(() => undefined);
    refreshAppliedTasks().catch(() => undefined);
  }, []);

  const taskCount = useMemo(() => tasks.length, [tasks]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await refreshTasks();
  };

  const handlePitchSubmit = async (event) => {
    event.preventDefault();
    await createPitch({
      taskId: pitchForm.taskId,
      coverLetter: pitchForm.coverLetter,
      proposedPrice: pitchForm.proposedPrice ? Number(pitchForm.proposedPrice) : undefined,
      timeline: pitchForm.timeline,
      sampleLinks: pitchForm.sampleLinks
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setPitchForm({ taskId: '', coverLetter: '', proposedPrice: '', timeline: '', sampleLinks: '' });
    await refreshMyPitches();
    await refreshAppliedTasks();
  };

  const handleImprovePitch = async () => {
    if (!pitchForm.coverLetter) return;

    const response = await improvePitch({
      coverLetter: pitchForm.coverLetter,
      sampleLinks: pitchForm.sampleLinks
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });

    setPitchForm((prev) => ({
      ...prev,
      coverLetter: response?.improvedPitch || response?.data || prev.coverLetter,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-white bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] p-8 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-800">Student workspace</p>
          <h1 className="mt-2 text-3xl font-black tracking-tighter sm:text-4xl">Browse tasks, submit pitches, and track your work</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium text-slate-700">
            Search live tasks, submit properly shaped pitches, and keep an eye on your submissions and applied work.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/student/tasks" className={tabClassName('/student/tasks')}>Browse tasks</Link>
            <Link to="/student/dashboard" className={tabClassName('/student/dashboard')}>Role hub</Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {currentView === 'dashboard' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Student hub</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Tasks', value: taskCount },
                    { label: 'Pitches', value: pitches.length },
                    { label: 'Applied', value: appliedTasks.length },
                  ].map((card) => (
                    <div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                      <p className="mt-2 text-3xl font-black text-slate-950">{card.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'tasks' && (
              <>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tasks</p>
                      <h2 className="text-2xl font-black tracking-[-0.04em]">Browse open tasks ({taskCount})</h2>
                    </div>
                  </div>

                  <form onSubmit={handleSearch} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search tasks" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3">
                      <option value="">All categories</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Branding">Branding</option>
                      <option value="Video/Editing">Video/Editing</option>
                      <option value="Growth/Outreach">Growth/Outreach</option>
                      <option value="Automation/Tech">Automation/Tech</option>
                      <option value="Research/Ops">Research/Ops</option>
                    </select>
                    <input value={filters.minBudget} onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })} placeholder="Min budget" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <input value={filters.maxBudget} onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })} placeholder="Max budget" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <button className="rounded-2xl bg-[#0070f3] px-4 py-3 text-sm font-bold text-white xl:col-span-4">Search</button>
                  </form>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((task) => (
                      <article key={task._id || task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        {(() => {
                          const rawLoc = task.location || task.businessId?.location || task.business?.location || task.city;
                          const locationText = rawLoc ? (typeof rawLoc === 'string' ? rawLoc : rawLoc.city || rawLoc.name || '') : '';

                          return (
                            <>
                              <h3 className="font-bold text-slate-950">{task.title || task.name || 'Untitled task'}</h3>
                              <p className="mt-2 text-sm text-slate-500">Location: {locationText || '—'}</p>
                            </>
                          );
                        })()}
                        <p className="mt-1 text-sm text-slate-600 line-clamp-3">{task.description || task.brief || 'No description provided.'}</p>
                        {renderAttachments(task.attachments)}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                          <span className="rounded-full bg-white px-2 py-1">{task.status || 'Open'}</span>
                          <span className="rounded-full bg-white px-2 py-1">Pitches: {task.pitchCount ?? 0}</span>
                          {(() => {
                            const rawLoc = task.location || task.businessId?.location || task.business?.location || task.city;
                            const locationText = rawLoc ? (typeof rawLoc === 'string' ? rawLoc : rawLoc.city || rawLoc.name || '') : '';
                            return <span className="rounded-full bg-white px-2 py-1">{locationText || '—'}</span>;
                          })()}
                          {task.budget ? <span className="rounded-full bg-white px-2 py-1">₹{task.budget}</span> : null}
                        </div>
                        <button type="button" onClick={() => setPitchForm((prev) => ({ ...prev, taskId: task._id || task.id }))} className="mt-4 rounded-xl bg-[#0070f3] px-3 py-2 text-xs font-bold text-white">
                          Pitch on this task
                        </button>
                      </article>
                    ))}
                  </div>
                </div>

                <form onSubmit={handlePitchSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Pitch</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Submit pitch</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input value={pitchForm.taskId} onChange={(e) => setPitchForm({ ...pitchForm, taskId: e.target.value })} placeholder="Task ID" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" />
                    <input value={pitchForm.proposedPrice} onChange={(e) => setPitchForm({ ...pitchForm, proposedPrice: e.target.value })} placeholder="Proposed price" type="number" min="0" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <input value={pitchForm.timeline} onChange={(e) => setPitchForm({ ...pitchForm, timeline: e.target.value })} placeholder="Timeline" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <input value={pitchForm.sampleLinks} onChange={(e) => setPitchForm({ ...pitchForm, sampleLinks: e.target.value })} placeholder="Sample links comma separated" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" />
                    <textarea value={pitchForm.coverLetter} onChange={(e) => setPitchForm({ ...pitchForm, coverLetter: e.target.value })} placeholder="Cover letter" className="min-h-32 rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button disabled={loading} className="rounded-2xl bg-[#0070f3] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Sending...' : 'Submit pitch'}</button>
                    <button type="button" onClick={handleImprovePitch} className="rounded-2xl bg-[#9c27b0] px-4 py-3 text-sm font-bold text-white">Improve with AI</button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="space-y-6">
            {currentView === 'dashboard' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Next steps</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Keep moving</h2>
                <p className="mt-3 text-sm text-slate-600">Open tasks to find work, then use the profile page from the navbar to update your details and portfolio.</p>
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Pitches</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">My pitches</h2>
              <div className="mt-4 space-y-3">
                {pitches.map((pitch) => (
                  <article key={pitch._id || pitch.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-bold text-slate-950">{pitch.taskId?.title || pitch.task?.title || 'Task pitch'}</p>
                    <p className="text-sm text-slate-600">{pitch.coverLetter || pitch.proposal || pitch.message || 'No pitch summary available.'}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      <span className="rounded-full bg-white px-2 py-1">{pitch.status || 'Pending'}</span>
                      {pitch.proposedPrice ? <span className="rounded-full bg-white px-2 py-1">₹{pitch.proposedPrice}</span> : null}
                    </div>
                  </article>
                ))}
                {!pitches.length ? <p className="text-sm text-slate-500">No pitches submitted yet.</p> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Applied tasks</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">My applications</h2>
              <div className="mt-4 space-y-3">
                {appliedTasks.map((entry) => (
                  <article key={entry.pitchId || entry._id || entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-bold text-slate-950">{entry.task?.title || entry.task?.name || 'Applied task'}</p>
                    <p className="text-sm text-slate-600">{entry.pitchStatus || 'Submitted'}</p>
                  </article>
                ))}
                {!appliedTasks.length ? <p className="text-sm text-slate-500">No applied tasks yet.</p> : null}
              </div>
            </div>

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
