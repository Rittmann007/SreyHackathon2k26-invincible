import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'business',
  phone: '',
  city: '',
  area: '',
  pincode: '',
  collegeName: '',
  businessName: '',
  businessType: '',
  description: '',
  website: '',
};

function Register() {
  const navigate = useNavigate();
  const { handleregister, loading, error, seterror, user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [clientErrors, setClientErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setClientErrors((prev) => ({ ...prev, [name]: '' }));

    if (error) seterror(null);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required';
    else if (form.name.trim().length < 3 || form.name.trim().length > 30) {
      nextErrors.name = 'Name must be 3-30 characters';
    }

    if (!form.email.trim()) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Invalid email format';
    }

    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';

    if (!form.role) nextErrors.role = 'Role is required';

    if (form.role === 'business') {
      if (!form.businessName.trim()) nextErrors.businessName = 'Business name is required';
      else if (form.businessName.trim().length > 150) {
        nextErrors.businessName = 'Business name must be at most 150 characters';
      }
    }

    if (form.collegeName.trim().length > 150) nextErrors.collegeName = 'College name must be at most 150 characters';
    if (form.phone.trim() && !/^\d{1,10}$/.test(form.phone.trim())) nextErrors.phone = 'Phone number must be up to 10 digits';
    if (form.businessType.trim().length > 100) nextErrors.businessType = 'Business type must be at most 100 characters';
    if (form.description.trim().length > 1000) nextErrors.description = 'Description must be at most 1000 characters';

    if (form.website.trim()) {
      try {
        const normalizedWebsite = form.website.startsWith('http') ? form.website : `https://${form.website}`;
        // eslint-disable-next-line no-new
        new URL(normalizedWebsite);
      } catch {
        nextErrors.website = 'Website must be a valid URL';
      }
    }

    if (form.pincode.trim() && !/^\d{4,10}$/.test(form.pincode.trim())) nextErrors.pincode = 'Pincode must be numeric';

    setClientErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      phone: form.phone.trim(),
      location: {
        city: form.city.trim(),
        area: form.area.trim(),
        pincode: form.pincode.trim(),
      },
      collegeName: form.role === 'student' ? form.collegeName.trim() : '',
      businessName: form.role === 'business' ? form.businessName.trim() : '',
      businessType: form.businessType.trim(),
      description: form.description.trim(),
      website: form.website.trim(),
    };

    try {
      await handleregister(payload);
      setSuccessMessage('Account created successfully.');
      setForm(initialForm);
    } catch {
      // backend error is already exposed by useAuth.error
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] px-4 py-8 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl rounded-[28px] border border-white/70 bg-white/30 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150 lg:p-6">
        <section className="rounded-3xl p-1">
          <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Register
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 sm:text-[15px]">
            Create your account as a business or student.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {(error || successMessage) && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                  error ? 'border border-rose-400/30 bg-rose-500/10 text-rose-900' : 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-900'
                }`}
              >
                {error || successMessage}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" error={clientErrors.name}>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>

              <Field label="Email address" error={clientErrors.email}>
                <input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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

              <Field label="Account type" error={clientErrors.role}>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="business">Business</option>
                  <option value="student">Student</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Phone number" error={clientErrors.phone}>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  maxLength={10}
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>

              <Field label="Website" error={clientErrors.website}>
                <input
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourbusiness.com"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="City">
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>

              <Field label="Area">
                <input
                  id="area"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Koramangala"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>

              <Field label="Pincode" error={clientErrors.pincode}>
                <input
                  id="pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="560034"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>
            </div>

            {form.role === 'business' ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Business name" error={clientErrors.businessName}>
                    <input
                      id="businessName"
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Cafe Bloom"
                      className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </Field>

                  <Field label="Business type" error={clientErrors.businessType}>
                    <input
                      id="businessType"
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      placeholder="Cafe, Salon, Clinic..."
                      className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </Field>
                </div>

                <Field label="Description" error={clientErrors.description}>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell students what kind of work you need help with..."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </Field>
              </>
            ) : (
              <Field label="College name" error={clientErrors.collegeName}>
                <input
                  id="collegeName"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  placeholder="MIT College"
                  className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </Field>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-[#0070f3] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(0,112,243,0.25)] transition hover:-translate-y-px hover:bg-[#0063db] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => setForm(initialForm)}
                className="inline-flex items-center justify-center rounded-2xl bg-[#9c27b0] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(156,39,176,0.22)] transition hover:-translate-y-px hover:bg-[#8a209d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Reset form
              </button>

              <p className="text-sm text-slate-700">
                Already have an account?{' '}
                <Link to="/login" className="font-extrabold text-slate-950 underline decoration-sky-500 decoration-2 underline-offset-4">
                  Log in
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

export default Register;