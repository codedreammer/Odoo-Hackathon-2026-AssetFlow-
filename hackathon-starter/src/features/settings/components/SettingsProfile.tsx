"use client";

import { useState } from "react";
import { Camera, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { type Profile } from "@/features/settings/actions";
import { getInitials, getAvatarStyle } from "@/lib/asset-ui";

// ─── Reusable field ───────────────────────────────────────────────────────────

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  suffix,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-[#374151]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-[13px] text-[#0F1117] placeholder:text-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 ${
            readOnly || disabled ? "bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed" : "bg-white"
          } ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const style = getAvatarStyle(name || "AD");
  const initials = getInitials(name || "Admin User");

  return (
    <div className="relative h-16 w-16 flex-shrink-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ${style.bg} ${style.text} text-[18px] font-semibold`}
        >
          {initials}
        </div>
      )}
      <button
        type="button"
        title="Change photo (coming soon)"
        className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#0F1117] text-white hover:bg-[#374151]"
      >
        <Camera size={11} />
      </button>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-[13px] font-medium shadow-lg ${
        type === "success"
          ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
          : "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]"
      }`}
    >
      {type === "success" && <Check size={14} />}
      {message}
    </div>
  );
}

// ─── Profile section ──────────────────────────────────────────────────────────

function ProfileSection({ profile }: { profile: Profile }) {
  const nameParts = (profile.full_name ?? "").split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [jobTitle, setJobTitle] = useState(profile.job_title ?? "");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${firstName} ${lastName}`.trim(),
          phone: phone || null,
          job_title: jobTitle || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      showToast("Profile saved successfully.", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${firstName} ${lastName}`.trim() || "Admin User";
  const roleLabel = profile.role ?? "Administrator";

  return (
    <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
      <h2 className="mb-5 text-[15px] font-semibold text-[#0F1117]">Profile</h2>

      {/* Avatar row */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={fullName} avatarUrl={profile.avatar_url} />
        <div>
          <p className="text-[15px] font-semibold text-[#0F1117]">{fullName}</p>
          <p className="text-[12px] text-[#6B7280]">
            {profile.email} · <span className="capitalize">{roleLabel}</span>
          </p>
          <button
            type="button"
            className="mt-1.5 text-[12px] font-medium text-[#4F46E5] hover:underline"
          >
            Change photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="First name"
          id="first-name"
          value={firstName}
          onChange={setFirstName}
          placeholder="First name"
        />
        <Field
          label="Last name"
          id="last-name"
          value={lastName}
          onChange={setLastName}
          placeholder="Last name"
        />
        <Field
          label="Email"
          id="email"
          type="email"
          value={profile.email ?? ""}
          readOnly
          placeholder="Email address"
        />
        <Field
          label="Phone"
          id="phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="mt-4">
        <Field
          label="Job title"
          id="job-title"
          value={jobTitle}
          onChange={setJobTitle}
          placeholder="e.g. System Administrator"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          id="save-profile-btn"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-[#0F1117] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1F2229] disabled:opacity-60"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Save changes
        </button>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </section>
  );
}

// ─── Password section ─────────────────────────────────────────────────────────

function PasswordSection() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = async () => {
    if (!newPw || newPw.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPw !== confirmPw) {
      showToast("Passwords do not match.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update password");
      showToast("Password updated successfully.", "success");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-[#E4E7EC] bg-white p-6">
      <h2 className="mb-1.5 text-[15px] font-semibold text-[#0F1117]">Change password</h2>
      <p className="mb-5 text-[12px] text-[#6B7280]">
        Must be at least 6 characters.
      </p>

      <div className="space-y-4">
        <Field
          label="Current password"
          id="current-password"
          type="password"
          value={currentPw}
          onChange={setCurrentPw}
          placeholder="••••••••"
        />
        <Field
          label="New password"
          id="new-password"
          type={showNew ? "text" : "password"}
          value={newPw}
          onChange={setNewPw}
          placeholder="••••••••"
          suffix={
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="text-[#9CA3AF] hover:text-[#374151]"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />
        <Field
          label="Confirm new password"
          id="confirm-password"
          type={showConfirm ? "text" : "password"}
          value={confirmPw}
          onChange={setConfirmPw}
          placeholder="••••••••"
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-[#9CA3AF] hover:text-[#374151]"
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          }
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          id="change-password-btn"
          onClick={handleChange}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-[#0F1117] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1F2229] disabled:opacity-60"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : null}
          Update password
        </button>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </section>
  );
}

// ─── Settings nav sidebar ─────────────────────────────────────────────────────

const SETTINGS_NAV = [
  { label: "Profile", id: "profile" },
  { label: "Organization", id: "organization", disabled: true },
  { label: "Roles & Permissions", id: "roles", disabled: true },
  { label: "Integrations", id: "integrations", disabled: true },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function SettingsProfile({ profile }: { profile: Profile }) {
  const [activeTab] = useState("profile");

  return (
    <div className="flex gap-8">
      {/* Settings sub-nav */}
      <nav className="w-44 flex-shrink-0">
        <ul className="space-y-0.5">
          {SETTINGS_NAV.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={item.disabled}
                className={`w-full rounded-md px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-[#0F1117] text-white"
                    : item.disabled
                    ? "cursor-not-allowed text-[#C4C9D4]"
                    : "text-[#374151] hover:bg-[#F3F4F6]"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 space-y-5">
        <ProfileSection profile={profile} />
        <PasswordSection />
      </div>
    </div>
  );
}
