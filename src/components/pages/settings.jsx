
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  Bell,
  Heart,
  CheckCircle2,
  Settings as SettingsIcon,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ============================================
// API CONFIGURATION
// ============================================

const API = "http://localhost:5000/api/users";

const defaultProfile = {
  fullName: "",
  email: "",
  phone: "",
};

const defaultNotifications = {
  emergencyAlerts: true,
  checkInReminders: true,
  safetyTips: true,
};

const Settings = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [profile, setProfile] = useState(defaultProfile);
  const [savedProfile, setSavedProfile] =
    useState(defaultProfile);

  const [notifications, setNotifications] = useState(
    defaultNotifications
  );

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] =
    useState(false);
  const [savingPassword, setSavingPassword] =
    useState(false);
  const [savingPreferences, setSavingPreferences] =
    useState(false);

  const [loadError, setLoadError] = useState("");
  const [profileMessage, setProfileMessage] =
    useState("");
  const [profileError, setProfileError] =
    useState("");
  const [passwordMessage, setPasswordMessage] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");
  const [preferencesMessage, setPreferencesMessage] =
    useState("");
  const [preferencesError, setPreferencesError] =
    useState("");

  // ==========================================
  // API REQUEST
  // ==========================================

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {
    const token = localStorage.getItem(
      "safeher_token"
    );

    if (!token) {
      navigate("/login", { replace: true });
      throw new Error("Please log in again.");
    }

    let response;

    try {
      response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    } catch {
      throw new Error(
        "Unable to connect to the server. Check that your backend is running."
      );
    }

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an invalid response."
      );
    }

    if (!response.ok || data.success === false) {
      // Incorrect current passwords also return 401.
      // Do not log users out for that error.
      if (
        response.status === 401 &&
        endpoint !== "/password"
      ) {
        localStorage.removeItem("safeher_token");
        localStorage.removeItem("safeher_user");

        navigate("/login", { replace: true });
      }

      throw new Error(
        data.message || "Request failed."
      );
    }

    return data;
  };

  // ==========================================
  // LOAD USER PROFILE
  // ==========================================

  const loadProfile = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await apiRequest("/profile");

      const user = data.user;

      const userProfile = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      };

      setProfile(userProfile);
      setSavedProfile(userProfile);

      setNotifications({
        emergencyAlerts:
          user.notifications?.emergencyAlerts ?? true,

        checkInReminders:
          user.notifications?.checkInReminders ?? true,

        safetyTips:
          user.notifications?.safetyTips ?? true,
      });

      localStorage.setItem(
        "safeher_user",
        JSON.stringify(user)
      );
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const fullName = profile.fullName.trim();
    const phone = profile.phone.trim();

    if (!fullName || fullName.length > 100) {
      setProfileError(
        "Full name must contain 1 to 100 characters."
      );
      return;
    }

    if (phone.length > 25) {
      setProfileError(
        "Phone number must not exceed 25 characters."
      );
      return;
    }

    setSavingProfile(true);

    try {
      const data = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName,
          phone,
        }),
      });

      const updatedProfile = {
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || "",
      };

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);

      localStorage.setItem(
        "safeher_user",
        JSON.stringify(data.user)
      );

      // Allow other components to refresh displayed
      // user details if they listen for this event.
      window.dispatchEvent(
        new Event("safeher-profile-updated")
      );

      setProfileMessage(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwords;

    if (!currentPassword) {
      setPasswordError(
        "Enter your current password."
      );
      return;
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 72
    ) {
      setPasswordError(
        "New password must contain 8 to 72 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "Choose a different password."
      );
      return;
    }

    setSavingPassword(true);

    try {
      const data = await apiRequest("/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswords(false);

      setPasswordMessage(
        data.message ||
          "Password changed successfully."
      );
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  // ==========================================
  // SAVE NOTIFICATION PREFERENCES
  // ==========================================

  const handlePreferencesSubmit = async () => {
    setPreferencesMessage("");
    setPreferencesError("");
    setSavingPreferences(true);

    try {
      const data = await apiRequest(
        "/notifications",
        {
          method: "PUT",
          body: JSON.stringify(notifications),
        }
      );

      setNotifications({
        emergencyAlerts:
          data.notifications?.emergencyAlerts ?? true,
        checkInReminders:
          data.notifications?.checkInReminders ?? true,
        safetyTips:
          data.notifications?.safetyTips ?? true,
      });

      setPreferencesMessage(
        "Your preferences have been saved."
      );
    } catch (error) {
      setPreferencesError(error.message);
    } finally {
      setSavingPreferences(false);
    }
  };

  // ==========================================
  // INPUT HANDLERS
  // ==========================================

  const updateProfileField = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setProfileMessage("");
    setProfileError("");
  };

  const updatePasswordField = (field, value) => {
    setPasswords((previous) => ({
      ...previous,
      [field]: value,
    }));

    setPasswordMessage("");
    setPasswordError("");
  };

  const updatePreference = (field, value) => {
    setNotifications((previous) => ({
      ...previous,
      [field]: value,
    }));

    setPreferencesMessage("");
    setPreferencesError("");
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7FC] text-[#6E4A91]">
        <Loader2
          size={36}
          className="animate-spin"
        />

        <p className="mt-4 text-sm font-semibold">
          Loading your SafeHer profile...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7FC] px-5 text-center">
        <AlertCircle
          size={42}
          className="text-red-500"
        />

        <h2 className="mt-4 text-xl font-bold text-[#38204F]">
          Unable to Load Profile
        </h2>

        <p className="mt-3 max-w-md text-sm text-gray-500">
          {loadError}
        </p>

        <button
          type="button"
          onClick={loadProfile}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-6 py-3 text-sm font-semibold text-white"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F9F7FC] text-[#38204F]">

      {/* HEADER */}

      <header className="border-b border-[#EEE6F3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6E4A91] text-white">
              <ShieldCheck size={24} />
            </div>

            <span className="text-2xl font-extrabold">
              SafeHer
              <span className="text-[#B78AC9]">
                .
              </span>
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E4A91] hover:underline"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* PAGE TITLE */}

        <div className="mb-9">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#8B5BAA]">
            My Account
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Profile & Settings
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Manage your personal details,
            account security and preferences.
          </p>
        </div>

        {/* PROFILE BANNER */}

        <section className="mb-8 flex flex-col items-start gap-5 rounded-2xl bg-[#624184] p-7 text-white sm:flex-row sm:items-center sm:p-9">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-white/20 text-3xl font-extrabold">
            {savedProfile.fullName
              .charAt(0)
              .toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">
              {savedProfile.fullName}
            </h2>

            <p className="mt-2 text-sm text-purple-100">
              {savedProfile.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
              <ShieldCheck size={15} />
              SafeHer Member
            </div>
          </div>

        </section>

        <div className="space-y-8">

          {/* ===================================
              PERSONAL INFORMATION
          =================================== */}

          <section className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1E8F8] text-[#6E4A91]">
                <UserRound size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your account details.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="grid gap-6 sm:grid-cols-2"
            >

              {/* FULL NAME */}

              <div>
                <label
                  htmlFor="settings-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="settings-name"
                    type="text"
                    required
                    maxLength={100}
                    value={profile.fullName}
                    onChange={(e) =>
                      updateProfileField(
                        "fullName",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#8B5BAA] focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="settings-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="settings-email"
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-500"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Email changes are not enabled yet.
                </p>
              </div>

              {/* PHONE */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="settings-phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="settings-phone"
                    type="tel"
                    maxLength={25}
                    placeholder="Enter your phone number"
                    value={profile.phone}
                    onChange={(e) =>
                      updateProfileField(
                        "phone",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#8B5BAA] focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* FEEDBACK */}

              {profileMessage && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-sm text-green-700 sm:col-span-2"
                >
                  <CheckCircle2 size={18} />
                  {profileMessage}
                </p>
              )}

              {profileError && (
                <p
                  role="alert"
                  className="flex items-center gap-2 text-sm text-red-600 sm:col-span-2"
                >
                  <AlertCircle size={18} />
                  {profileError}
                </p>
              )}

              {/* SAVE */}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#563775] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  {savingProfile
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </div>

            </form>
          </section>

          {/* ===================================
              PASSWORD & SECURITY
          =================================== */}

          <section className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FCECF1] text-[#C16B8B]">
                <LockKeyhole size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Password & Security
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Change your account password securely.
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5"
            >

              {[
                {
                  name: "currentPassword",
                  label: "Current Password",
                },
                {
                  name: "newPassword",
                  label: "New Password",
                },
                {
                  name: "confirmPassword",
                  label: "Confirm New Password",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-semibold"
                  >
                    {field.label}
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id={field.name}
                      type={
                        showPasswords
                          ? "text"
                          : "password"
                      }
                      required
                      minLength={
                        field.name === "currentPassword"
                          ? undefined
                          : 8
                      }
                      maxLength={
                        field.name === "currentPassword"
                          ? undefined
                          : 72
                      }
                      value={passwords[field.name]}
                      onChange={(e) =>
                        updatePasswordField(
                          field.name,
                          e.target.value
                        )
                      }
                      placeholder={field.label}
                      autoComplete={
                        field.name === "currentPassword"
                          ? "current-password"
                          : "new-password"
                      }
                      className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-12 text-sm outline-none focus:border-[#8B5BAA] focus:ring-2 focus:ring-purple-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords(
                          !showPasswords
                        )
                      }
                      aria-label={
                        showPasswords
                          ? "Hide passwords"
                          : "Show passwords"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6E4A91]"
                    >
                      {showPasswords ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {passwordMessage && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-sm text-green-700"
                >
                  <CheckCircle2 size={18} />
                  {passwordMessage}
                </p>
              )}

              {passwordError && (
                <p
                  role="alert"
                  className="flex items-center gap-2 text-sm text-red-600"
                >
                  <AlertCircle size={18} />
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#563775] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPassword ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <LockKeyhole size={18} />
                )}

                {savingPassword
                  ? "Updating Password..."
                  : "Update Password"}
              </button>

            </form>
          </section>

          {/* ===================================
              ACCOUNT PREFERENCES
          =================================== */}

          <section className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4F1] text-[#468E82]">
                <SettingsIcon size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Account Preferences
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your saved notification preferences.
                </p>
              </div>
            </div>

            <div className="space-y-6">

              {/* EMERGENCY ALERTS */}

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div className="flex items-start gap-3">
                  <Bell
                    size={21}
                    className="mt-1 shrink-0 text-[#8B5BAA]"
                  />

                  <div>
                    <h3 className="text-sm font-bold">
                      Emergency Alerts
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                      Save your preference for future
                      emergency notifications.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={notifications.emergencyAlerts}
                  onChange={(e) =>
                    updatePreference(
                      "emergencyAlerts",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 shrink-0 accent-[#6E4A91]"
                />
              </label>

              <div className="border-t border-gray-100" />

              {/* CHECK-IN REMINDERS */}

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div className="flex items-start gap-3">
                  <Bell
                    size={21}
                    className="mt-1 shrink-0 text-[#8B5BAA]"
                  />

                  <div>
                    <h3 className="text-sm font-bold">
                      Check-In Reminders
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                      Save your preference for future
                      safety check-in reminders.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={notifications.checkInReminders}
                  onChange={(e) =>
                    updatePreference(
                      "checkInReminders",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 shrink-0 accent-[#6E4A91]"
                />
              </label>

              <div className="border-t border-gray-100" />

              {/* SAFETY TIPS */}

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div className="flex items-start gap-3">
                  <Heart
                    size={21}
                    className="mt-1 shrink-0 text-[#8B5BAA]"
                  />

                  <div>
                    <h3 className="text-sm font-bold">
                      Safety Tips
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-gray-500">
                      Save your preference for future
                      safety tips and resources.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={notifications.safetyTips}
                  onChange={(e) =>
                    updatePreference(
                      "safetyTips",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 shrink-0 accent-[#6E4A91]"
                />
              </label>

            </div>

            {/* PREFERENCES FEEDBACK */}

            {preferencesMessage && (
              <p
                role="status"
                className="mt-6 flex items-center gap-2 text-sm text-green-700"
              >
                <CheckCircle2 size={18} />
                {preferencesMessage}
              </p>
            )}

            {preferencesError && (
              <p
                role="alert"
                className="mt-6 flex items-center gap-2 text-sm text-red-600"
              >
                <AlertCircle size={18} />
                {preferencesError}
              </p>
            )}

            <button
              type="button"
              onClick={handlePreferencesSubmit}
              disabled={savingPreferences}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#563775] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPreferences ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Save size={18} />
              )}

              {savingPreferences
                ? "Saving Preferences..."
                : "Save Preferences"}
            </button>

            <p className="mt-5 text-xs leading-6 text-gray-400">
              These settings are saved in your
              account, but automatic emergency alerts,
              reminders and emails are not currently
              enabled.
            </p>

          </section>
        </div>

        {/* FOOTER */}

        <div className="mt-9 flex items-start gap-3 rounded-xl bg-[#F1E8F8] p-5 text-sm leading-7 text-[#655574]">
          <Heart
            size={20}
            className="mt-1 shrink-0 text-[#6E4A91]"
          />

          <p>
            Your privacy and personal safety matter.
            Your profile and preferences are stored
            in your SafeHer account.
          </p>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} SafeHer.
          All rights reserved.
        </p>

      </main>
    </div>
  );
};

export default Settings;
