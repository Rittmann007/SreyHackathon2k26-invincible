import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const initialForm = {
  email: '',
  password: '',
};

function Login() {
  const navigate = useNavigate();
  const { handlelogin, loading, error, seterror, user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [clientErrors, setClientErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setClientErrors((prev) => ({ ...prev, [name]: '' }));
    if (error) seterror(null);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Invalid email format';
    }

    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    setClientErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      await handlelogin({ email: form.email.trim(), password: form.password });
      navigate("/dashboard")
    } catch {
      // backend error is already exposed by useAuth.error
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] px-4 py-8 font-sans text-slate-900 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />

      <div className="relative z-10 mx-auto w-full max-w-md rounded-[28px] border border-white/70 bg-white/30 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150 lg:p-8">
        <section className="rounded-3xl p-1">
          <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Log in
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-700 sm:text-[15px]">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {error && (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-900">
                {error}
              </div>
            )}

            <Field label="Email address" error={clientErrors.email}>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </Field>

            <Field label="Password" error={clientErrors.password}>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-[#0070f3] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(0,112,243,0.25)] transition hover:-translate-y-px hover:bg-[#0063db] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="text-sm text-slate-700">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-extrabold text-slate-950 underline decoration-sky-500 decoration-2 underline-offset-4"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-slate-800">{label}</label>
      {children}
      {error ? <span className="text-xs font-semibold text-[#e91e63]">{error}</span> : null}
    </div>
  );
}

export default Login;