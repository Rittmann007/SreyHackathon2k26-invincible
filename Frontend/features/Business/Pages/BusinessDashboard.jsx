import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../Auth/Pages/Navbar';
import useAuth from '../../Auth/Hooks/useAuth';
import useBusiness from '../Hooks/useBusiness';

function BusinessDashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const { loading, error, getMyTasks, getTaskPitches, createTask, uploadAssets, advanceTask, deleteTask, acceptPitch, rejectPitch, releasePayment } = useBusiness();
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [pitches, setPitches] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', category: '', budget: '', deadline: '', location: '', requiredSkills: '' });
  const [taskFiles, setTaskFiles] = useState([]);
  const [taskAttachments, setTaskAttachments] = useState([]);

  const currentPath = location.pathname;
  const currentView = currentPath === '/business/tasks'
    ? 'tasks'
    : 'dashboard';

  const tabClassName = (path) =>
    `rounded-2xl px-4 py-2 text-sm font-bold transition ${
      currentPath === path
        ? 'bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]'
        : 'border border-slate-950/10 bg-white/40 text-slate-950 hover:bg-white/65'
    }`;

  const summaryCards = [
    { label: 'Tasks', value: tasks.length },
    { label: 'Selected task', value: selectedTaskId ? '1' : '0' },
    { label: 'Pitches', value: pitches.length },
  ];

  const refreshTasks = async () => {
    const response = await getMyTasks();
    const nextTasks = response.tasks || response.data || response || [];
    setTasks(nextTasks);

    const firstTask = nextTasks[0];

    if (!nextTasks.some((task) => (task._id || task.id) === selectedTaskId)) {
      setSelectedTaskId(firstTask?._id || firstTask?.id || '');
    } else if (!selectedTaskId && firstTask?._id) {
      setSelectedTaskId(firstTask._id);
    }
  };

  useEffect(() => {
    refreshTasks().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!selectedTaskId) return;
    getTaskPitches(selectedTaskId)
      .then((response) => {
        const nextPitches = response.pitches || response.data || response || [];
        setPitches((Array.isArray(nextPitches) ? nextPitches : []).filter((pitch) => (pitch.status || '').trim() !== 'Rejected'));
      })
      .catch(() => setPitches([]));
  }, [selectedTaskId]);

  const taskCount = useMemo(() => tasks.length, [tasks]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title || !taskForm.description || !taskForm.category || !taskForm.budget || !taskForm.deadline) {
      return;
    }

    const selectedDeadline = new Date(taskForm.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDeadline.getTime()) || selectedDeadline <= today) {
      return;
    }

    let attachments = taskAttachments;

    if (taskFiles.length > 0) {
      const uploadResponse = await uploadAssets(taskFiles);
      attachments = uploadResponse?.attachments || uploadResponse?.data || uploadResponse || [];
      setTaskAttachments(attachments);
    }

    const payload = {
      ...taskForm,
      budget: taskForm.budget ? Number(taskForm.budget) : undefined,
      requiredSkills: taskForm.requiredSkills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      attachments,
    };
    await createTask(payload);
    setTaskForm({ title: '', description: '', category: '', budget: '', deadline: '', location: '', requiredSkills: '' });
    setTaskFiles([]);
    setTaskAttachments([]);
    await refreshTasks();
  };

  const handleTaskAction = async (task) => {
    const taskStatus = (task.status || 'Open').trim();

    if (taskStatus === 'Open') {
      await advanceTask(task._id || task.id, { status: 'In Progress' });
    } else if (taskStatus === 'In Progress') {
      await advanceTask(task._id || task.id, { status: 'Revision' });
    } else if (taskStatus === 'Revision') {
      await advanceTask(task._id || task.id, { status: 'Completed' });
    }

    await refreshTasks();
  };

  const handleDeleteOrCancel = async (task) => {
    const taskStatus = (task.status || 'Open').trim();
    const taskId = task._id || task.id;
    const nextTasks = tasks.filter((item) => (item._id || item.id) !== taskId);

    setTasks(nextTasks);

    if (selectedTaskId === taskId) {
      setPitches([]);
      setSelectedTaskId(nextTasks[0]?._id || nextTasks[0]?.id || '');
    }

    if (taskStatus === 'Open' || taskStatus === 'Completed' || taskStatus === 'Cancelled') {
      await deleteTask(taskId);
    } else if (taskStatus !== 'Paid') {
      const response = await getTaskPitches(taskId);
      const taskPitches = response?.pitches || response?.data || response || [];

      await Promise.all(
        (Array.isArray(taskPitches) ? taskPitches : [])
          .filter((pitch) => ['Submitted', 'Shortlisted'].includes((pitch.status || '').trim()))
          .map((pitch) => rejectPitch(pitch._id || pitch.id, { feedback: 'Task cancelled by business' }))
      );

      setPitches([]);

      await advanceTask(taskId, { status: 'Cancelled' });
    }
  };

  const handleActionOnPitch = async (pitchId, action) => {
    if (action === 'accept') await acceptPitch(pitchId);
    if (action === 'reject') await rejectPitch(pitchId, { feedback: 'Not selected' });
    if (action === 'release') {
      await releasePayment(pitchId);
      setPitches([]);
      await refreshTasks();
      return;
    }
    if (selectedTaskId) {
      const response = await getTaskPitches(selectedTaskId);
      const nextPitches = response.pitches || response.data || response || [];
      setPitches((Array.isArray(nextPitches) ? nextPitches : []).filter((pitch) => (pitch.status || '').trim() !== 'Rejected'));
    }
    await refreshTasks();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-white bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] p-8 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-800">Business workspace</p>
          <h1 className="mt-2 text-3xl font-black tracking-tighter sm:text-4xl">Manage tasks, pitches, and payouts</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium text-slate-700">
            Create work, review pitches, move task stages, and release payment when the job is complete.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/business/tasks" className={tabClassName('/business/tasks')}>Tasks</Link>
            <Link to="/business/dashboard" className={tabClassName('/business/dashboard')}>Role hub</Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {currentView === 'dashboard' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Business hub</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {summaryCards.map((card) => (
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
                      <h2 className="text-2xl font-black tracking-[-0.04em]">My tasks ({taskCount})</h2>
                    </div>
                    <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                      <option value="">Select task</option>
                      {tasks.map((task) => (
                        <option key={task._id || task.id} value={task._id || task.id}>{task.title || task.name || 'Untitled task'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((task) => (
                      <article key={task._id || task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        {(() => {
                          const taskStatus = (task.status || 'Open').trim();
                          const isTerminal = ['Completed', 'Cancelled'].includes(taskStatus);

                          const rawLoc = task.location || task.businessId?.location || task.business?.location || task.city;
                          const locationText = rawLoc ? (typeof rawLoc === 'string' ? rawLoc : rawLoc.city || rawLoc.name || '') : '';

                          return (
                            <>
                        <h3 className="font-bold text-slate-950">{task.title || task.name || 'Untitled task'}</h3>
                        <p className="mt-2 text-sm text-slate-500">Location: {locationText || '—'}</p>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-3">{task.description || task.brief || 'No description provided.'}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                          <span className="rounded-full bg-white px-2 py-1">{taskStatus}</span>
                          <span className="rounded-full bg-white px-2 py-1">Pitches: {task.pitchCount ?? task.pitches?.length ?? 0}</span>
                          <span className="rounded-full bg-white px-2 py-1">{locationText || '—'}</span>
                          {task.budget ? <span className="rounded-full bg-white px-2 py-1">₹{task.budget}</span> : null}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {isTerminal ? (
                            <button onClick={() => handleDeleteOrCancel(task)} className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white">
                              Delete
                            </button>
                          ) : (
                            <>
                              <button onClick={() => handleTaskAction(task)} className="rounded-xl bg-[#0070f3] px-3 py-2 text-xs font-bold text-white">
                                {taskStatus === 'Open' ? 'Start' : taskStatus === 'In Progress' ? 'Move to revision' : 'Mark completed'}
                              </button>
                              <button onClick={() => handleDeleteOrCancel(task)} className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white">
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                            </>
                          );
                        })()}
                      </article>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCreateTask} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Create task</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">New task brief</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Title" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <select value={taskForm.category} onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3">
                      <option value="">Select category</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Branding">Branding</option>
                      <option value="Video/Editing">Video/Editing</option>
                      <option value="Growth/Outreach">Growth/Outreach</option>
                      <option value="Automation/Tech">Automation/Tech</option>
                      <option value="Research/Ops">Research/Ops</option>
                    </select>
                    <input value={taskForm.budget} onChange={(e) => setTaskForm({ ...taskForm, budget: e.target.value })} placeholder="Budget" type="number" min="0" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <input value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} type="date" min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className="rounded-xl border border-slate-200 px-4 py-3" />
                    <input value={taskForm.location} onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3" />
                    <input value={taskForm.requiredSkills} onChange={(e) => setTaskForm({ ...taskForm, requiredSkills: e.target.value })} placeholder="Required skills comma separated" className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" />
                    <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Task description" className="min-h-32 rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" />
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setTaskFiles(Array.from(e.target.files || []))}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 md:col-span-2"
                    />
                    <p className="text-xs text-slate-500 md:col-span-2">
                      Selected files: {taskFiles.length} | Uploaded attachments: {taskAttachments.length}
                    </p>
                  </div>
                  <button disabled={loading} className="mt-4 rounded-2xl bg-[#0070f3] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Saving...' : 'Create task'}</button>
                </form>
              </>
            )}

          </div>


          <div className="space-y-6">
            {currentView === 'dashboard' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Next steps</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Use the workspace tabs</h2>
                <p className="mt-3 text-sm text-slate-600">Open Tasks to manage jobs from this workspace, or keep this hub as a summary view.</p>
              </div>
            )}

            {currentView !== 'dashboard' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Pitches</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Task pitches</h2>
                <div className="mt-4 space-y-3">
                  {pitches.map((pitch) => (
                    <article key={pitch._id || pitch.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-bold text-slate-950">{pitch.studentName || pitch.student?.name || 'Student pitch'}</p>
                      <p className="text-sm text-slate-600">{pitch.coverLetter || pitch.message || pitch.proposal || 'No pitch summary available.'}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        <span className="rounded-full bg-white px-2 py-1">{pitch.status || 'Pending'}</span>
                        {pitch.trustTier ? <span className="rounded-full bg-white px-2 py-1">Trust {pitch.trustTier}</span> : null}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => handleActionOnPitch(pitch._id || pitch.id, 'accept')} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Accept</button>
                        <button onClick={() => handleActionOnPitch(pitch._id || pitch.id, 'reject')} className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white">Reject</button>
                        <button onClick={() => handleActionOnPitch(pitch._id || pitch.id, 'release')} className="rounded-xl bg-[#0070f3] px-3 py-2 text-xs font-bold text-white">Release payment</button>
                      </div>
                    </article>
                  ))}
                  {!pitches.length ? <p className="text-sm text-slate-500">Select a task to review pitches.</p> : null}
                </div>
              </div>
            )}

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BusinessDashboard;