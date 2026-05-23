import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-toastify";

function OtpSubmit() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email?.trim().toLowerCase();

  const { loading, handleOtpSubmit } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      if (error) setError(null);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    setError(null);

    try {
      await handleOtpSubmit({ otp, email });
      navigate("/dashboard");
    } catch (error) {
      setError(error?.response?.data?.message || "OTP verification failed");
    }
  }

  if (!email) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] px-4 text-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/70 bg-white/30 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150">
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
            <p className="text-sm font-semibold text-rose-900">
              Email not found. Please register again.
            </p>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="mt-4 w-full rounded-2xl bg-[#0070f3] px-4 py-3 font-bold text-white shadow-[0_18px_30px_rgba(0,112,243,0.25)] transition hover:bg-[#0063db]"
          >
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] px-4 text-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/70 bg-white/30 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/30 shadow-inner">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0070f3] border-t-transparent"></div>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">Verifying OTP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#74b9ff_0%,#a29bfe_100%)] px-4 py-8 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.12))]" />

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/70 bg-white/30 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-[20px] saturate-150 sm:p-8">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="mx-auto mb-2 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-900">
              OTP verification
            </div>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950">Verify Email</h1>
            <p className="text-sm text-slate-700">
              Enter the OTP sent to <span className="font-bold text-slate-950">{email}</span>
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3">
              <p className="text-sm font-semibold text-rose-900">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-bold text-slate-800">
                Enter OTP (6 digits)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                maxLength="6"
                className="w-full rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-4 text-center text-2xl font-bold tracking-[0.35em] text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
              <p className="text-xs text-slate-600">
                OTP is valid for 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6 || loading}
              className={`w-full rounded-2xl px-4 py-3 font-bold transition ${
                otp.length === 6
                  ? "bg-[#0070f3] text-white shadow-[0_18px_30px_rgba(0,112,243,0.25)] hover:bg-[#0063db] cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="space-y-2 text-center">
            <p className="text-sm text-slate-700">Didn't receive the OTP?</p>
            <button
              onClick={() => navigate("/register")}
              className="font-bold text-[#9c27b0] transition hover:text-[#8a209d]"
            >
              Register Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpSubmit;