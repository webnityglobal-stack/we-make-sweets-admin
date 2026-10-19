import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import authService from "@/services/auth.services";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step 1: Send OTP | Step 2: Verify OTP | Step 3: Set New Password | Step 4: Success
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState(""); // "email" | "whatsapp"
  const [channelInfo, setChannelInfo] = useState("");
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Auto-detect if user entered email or phone
  const isEmailInput = identifier.includes("@");
  const isPhoneInput =
    /^[0-9+ ]+$/.test(identifier.trim()) && identifier.trim().length >= 10;

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // =====================================================
  // STEP 1: SEND OTP (Email or WhatsApp)
  // =====================================================
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError("Please enter your registered Email address or Mobile number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessNotice("");

      const response = await authService.forgotPassword(cleanIdentifier);

      const ch =
        response.channel ||
        (cleanIdentifier.includes("@") ? "email" : "whatsapp");
      setChannel(ch);
      setChannelInfo(response.message || "");

      setSuccessNotice(
        response.message ||
          (ch === "whatsapp"
            ? "OTP sent to your WhatsApp number!"
            : "OTP sent to your Email address!")
      );

      setResendTimer(60); // 60s cooldown
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      const msg =
        err.message ||
        "Failed to send OTP. Please check your registered details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 2: VERIFY OTP
  // =====================================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessNotice("");

      const response = await authService.verifyResetOTP(
        identifier.trim(),
        cleanOtp
      );

      setSuccessNotice(response.message || "OTP verified successfully!");
      setStep(3);
    } catch (err) {
      console.error("Verify OTP error:", err);
      const msg =
        err.message || "Invalid OTP code. Please check the code and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 3: SET NEW PASSWORD
  // =====================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessNotice("");

      const response = await authService.resetPassword(
        identifier.trim(),
        newPassword
      );

      setSuccessNotice(
        response.message ||
          "Password reset successfully! You can now log in."
      );
      setStep(4); // Success screen
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err.message || "Unable to reset password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5ebda] min-h-screen flex flex-col items-center justify-center px-4 py-10 selection:bg-[#572340] selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#572340]">
              WeMake Sweets & Snacks
            </h1>
          </div>
          <p className="text-sm font-medium text-gray-600">
            Account Security & Password Recovery
          </p>
        </div>

        {/* Step Progress Indicator */}
        {step < 4 && (
          <div className="mb-6 flex items-center justify-between px-3">
            {[
              { num: 1, label: "Enter Details" },
              { num: 2, label: "Verify OTP" },
              { num: 3, label: "New Password" },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step > s.num
                        ? "bg-emerald-600 text-white shadow-sm"
                        : step === s.num
                        ? "bg-[#572340] text-white ring-4 ring-[#572340]/20 shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span
                    className={`mt-1 text-[11px] font-semibold tracking-tight ${
                      step >= s.num ? "text-[#572340]" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 -mt-4 transition-colors duration-300 ${
                      step > s.num ? "bg-emerald-500" : "bg-gray-300/80"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl px-6 py-8 sm:px-8 border border-[#572340]/10">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Enter Verification OTP"}
              {step === 3 && "Set New Password"}
              {step === 4 && "Password Reset Successful!"}
            </h2>

            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {step === 1 &&
                "Enter your registered Email or WhatsApp mobile number to receive a verification OTP."}
              {step === 2 && (
                <>
                  We sent a 6-digit OTP to your{" "}
                  <strong className="text-gray-800 font-semibold">
                    {channel === "whatsapp" ? "WhatsApp" : "Email"}
                  </strong>{" "}
                  ({identifier}).
                </>
              )}
              {step === 3 &&
                "Your identity is verified! Choose a strong password of at least 6 characters."}
              {step === 4 &&
                "Your password has been updated securely. You can now login with your new credentials."}
            </p>
          </div>

          {/* Error Banner */}
          {error && step < 4 && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="text-red-500 mt-0.5 text-base">⚠️</span>
              <p className="text-xs sm:text-sm font-medium text-red-700 leading-5">
                {error}
              </p>
            </div>
          )}

          {/* Success Notification Banner */}
          {successNotice && step < 4 && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-emerald-800 leading-5">
                {successNotice}
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 1: Enter Identifier (Email or Mobile) */}
          {/* ================================================= */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError("");
                      setSuccessNotice("");
                    }}
                    placeholder="e.g. name@example.com or 9876543210"
                    className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-[#572340] focus:ring-2 focus:ring-[#572340]/20 text-gray-900 bg-white"
                    autoFocus
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {isEmailInput ? (
                      <Mail size={18} className="text-[#572340]" />
                    ) : isPhoneInput ? (
                      <Phone size={18} className="text-emerald-600" />
                    ) : (
                      <ShieldCheck size={18} />
                    )}
                  </div>
                </div>

                {/* Channel Indicator / Tip */}
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                  {isPhoneInput ? (
                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                      💬 OTP will be sent to your WhatsApp number
                    </span>
                  ) : isEmailInput ? (
                    <span className="text-[#572340] font-semibold inline-flex items-center gap-1">
                      ✉️ OTP will be sent to your Email inbox
                    </span>
                  ) : (
                    <span>
                      💡 Enter an Email to get OTP via inbox, or 10-digit number to get OTP on WhatsApp!
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !identifier.trim()}
                className="w-full rounded-xl bg-[#572340] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#431b31] hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send Verification OTP"
                )}
              </button>
            </form>
          )}

          {/* ================================================= */}
          {/* STEP 2: Verify OTP */}
          {/* ================================================= */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              {/* Channel badge */}
              <div
                className={`p-3 rounded-2xl border flex items-center gap-3 ${
                  channel === "whatsapp"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-[#572340]/5 border-[#572340]/20 text-[#572340]"
                }`}
              >
                {channel === "whatsapp" ? (
                  <Phone size={22} className="shrink-0 text-emerald-600" />
                ) : (
                  <Mail size={22} className="shrink-0 text-[#572340]" />
                )}
                <div className="text-xs">
                  <p className="font-bold">
                    {channel === "whatsapp" ? "WhatsApp Bot OTP" : "Email OTP"}
                  </p>
                  <p className="opacity-90 font-medium">{identifier}</p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="• • • • • •"
                  className="w-full tracking-[10px] text-center font-bold text-2xl rounded-xl border border-gray-300 py-3 outline-none transition focus:border-[#572340] focus:ring-2 focus:ring-[#572340]/20 text-gray-900 bg-white"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-xl bg-[#572340] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#431b31] hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              {/* Resend & Change options */}
              <div className="flex justify-between items-center pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setSuccessNotice("");
                  }}
                  className="text-gray-500 hover:text-[#572340] hover:underline cursor-pointer"
                >
                  ← Change Email/Phone
                </button>

                {resendTimer > 0 ? (
                  <span className="text-gray-400 font-medium">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-[#572340] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={12} /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* ================================================= */}
          {/* STEP 3: Set New Password */}
          {/* ================================================= */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>OTP verified! Please create your new password.</span>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-gray-300 pl-4 pr-11 py-3 text-sm outline-none transition focus:border-[#572340] focus:ring-2 focus:ring-[#572340]/20 text-gray-900 bg-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Re-enter new password"
                    className="w-full rounded-xl border border-gray-300 pl-4 pr-11 py-3 text-sm outline-none transition focus:border-[#572340] focus:ring-2 focus:ring-[#572340]/20 text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full rounded-xl bg-[#572340] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#431b31] hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Set New Password"
                )}
              </button>
            </form>
          )}

          {/* ================================================= */}
          {/* STEP 4: Success Screen */}
          {/* ================================================= */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Your password has been changed successfully. You can now login with your new credentials.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full rounded-xl bg-[#572340] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#431b31] transition cursor-pointer"
              >
                Login Now
              </button>
            </div>
          )}

          {/* Back to Login Link */}
          {step < 4 && (
            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#572340] hover:underline"
              >
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;