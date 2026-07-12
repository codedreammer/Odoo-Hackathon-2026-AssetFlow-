"use client";

import { useState } from "react";
import { Camera, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { type Profile } from "@/features/settings/actions";
import { getInitials, getAvatarStyle } from "@/lib/asset-ui";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
  error,
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
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`${suffix ? "pr-10" : ""} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
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
        <img src={avatarUrl} alt={name} className="h-16 w-16 rounded-full object-cover" />
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
        className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-zinc-900 dark:bg-zinc-50 text-white hover:bg-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
      >
        <Camera size={11} />
      </button>
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
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    setAlert(null);
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
      showAlert("Profile saved successfully.", "success");
    } catch (err: unknown) {
      showAlert(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${firstName} ${lastName}`.trim() || "Admin User";
  const roleLabel = profile.role ?? "Administrator";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      {alert && (
        <Alert variant={alert.type === "success" ? "success" : "destructive"} className="mb-4">
          <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <h2 className="mb-5 text-lg font-semibold text-zinc-950 dark:text-zinc-50">Profile</h2>

      {/* Avatar row */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={fullName} avatarUrl={profile.avatar_url} />
        <div>
          <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{fullName}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {profile.email} · <span className="capitalize">{roleLabel}</span>
          </p>
          <button type="button" className="mt-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Change photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Button disabled={saving} onClick={handleSave} className="gap-2">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Save changes
        </Button>
      </div>
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
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleChange = async () => {
    if (!newPw || newPw.length < 6) {
      showAlert("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPw !== confirmPw) {
      showAlert("Passwords do not match.", "error");
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update password");
      showAlert("Password updated successfully.", "success");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: unknown) {
      showAlert(err instanceof Error ? err.message : "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      {alert && (
        <Alert variant={alert.type === "success" ? "success" : "destructive"} className="mb-4">
          <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <h2 className="mb-1.5 text-lg font-semibold text-zinc-950 dark:text-zinc-50">Change password</h2>
      <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">Must be at least 6 characters.</p>

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
            <Button variant="ghost" size="icon" onClick={() => setShowNew((v) => !v)} aria-label={showNew ? "Hide password" : "Show password"}>
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
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
            <Button variant="ghost" size="icon" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Hide password" : "Show password"}>
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
          }
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button disabled={saving} onClick={handleChange} className="gap-2">
          {saving ? <Loader2 size={13} className="animate-spin" /> : null}
          Update password
        </Button>
      </div>
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
              <Button
                type="button"
                variant={activeTab === item.id ? "default" : "ghost"}
                disabled={item.disabled}
                className="w-full justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.label}
              </Button>
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