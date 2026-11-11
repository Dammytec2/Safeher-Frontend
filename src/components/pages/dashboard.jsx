
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  MapPin,
  Siren,
  Clock3,
  BookOpen,
  Heart,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Activity,
  Users,
  ShieldCheck,
  MessageCircle,
  RefreshCw,
  X,
} from "lucide-react";

// =============================================
// API CONFIGURATION
// =============================================

const API = "http://localhost:5000";

// =============================================
// HELPER FUNCTIONS
// =============================================

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const getMapsLink = (location) => {
  if (
    location?.latitude == null ||
    location?.longitude == null
  ) {
    return "";
  }

  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
};

const getBrowserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Location is not supported by this browser."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        });
      },
      (error) => {
        const messages = {
          1: "Location permission was denied.",
          2: "Your location is unavailable.",
          3: "Location request timed out.",
        };

        reject(
          new Error(
            messages[error.code] ||
              "Unable to get your location."
          )
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });

const normalizeWhatsAppPhone = (value) => {
  let phone = String(value || "").replace(/\D/g, "");

  if (phone.startsWith("00234")) {
    phone = phone.slice(2);
  }

  if (phone.startsWith("0") && phone.length === 11) {
    phone = `234${phone.slice(1)}`;
  } else if (
    phone.length === 10 &&
    /^[789]/.test(phone)
  ) {
    phone = `234${phone}`;
  }

  return /^[1-9]\d{7,14}$/.test(phone)
    ? phone
    : null;
};

// =============================================
// DASHBOARD COMPONENT
// =============================================

const Dashboard = () => {
  const navigate = useNavigate();

  // ===========================================
  // DASHBOARD STATES
  // ===========================================

  const [stats, setStats] = useState(null);

  const [savedActivity, setSavedActivity] = useState([]);

  const [activity, setActivity] = useState([]);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [dashboardError, setDashboardError] =
    useState("");

  // ===========================================
  // LOCATION STATES
  // ===========================================

  const [location, setLocation] = useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationStatus, setLocationStatus] =
    useState("");

  // ===========================================
  // CHECK-IN STATES
  // ===========================================

  const [checkInMinutes, setCheckInMinutes] =
    useState("30");

  const [checkIn, setCheckIn] = useState(null);

  const [checkInHistory, setCheckInHistory] =
    useState([]);

  const [checkInLoading, setCheckInLoading] =
    useState(true);

  const [checkInSaving, setCheckInSaving] =
    useState(false);

  const [checkInError, setCheckInError] =
    useState("");

  const [checkInSuccess, setCheckInSuccess] =
    useState("");

  // ===========================================
  // SOS STATES
  // ===========================================

  const [showSOS, setShowSOS] = useState(false);

  const [sosLocation, setSOSLocation] =
    useState(null);

  const [
    sosLocationVerified,
    setSOSLocationVerified,
  ] = useState(false);

  const [
    sosLocationError,
    setSOSLocationError,
  ] = useState("");

  const [sosMessage, setSOSMessage] = useState(
    "I need immediate assistance. Please contact me."
  );

  const [sosError, setSOSError] = useState("");

  const [sosLoading, setSOSLoading] =
    useState(false);

  const [sosSaved, setSOSSaved] =
    useState(null);

  const [sosHistory, setSOSHistory] =
    useState([]);

  const [
    sosHistoryError,
    setSOSHistoryError,
  ] = useState("");

  const [resolvingId, setResolvingId] =
    useState(null);

  // ===========================================
  // TRUSTED CONTACT STATES
  // ===========================================

  const [
    trustedContacts,
    setTrustedContacts,
  ] = useState([]);

  const [contactError, setContactError] =
    useState("");

  // ===========================================
  // CURRENT USER
  // ===========================================

  const storedUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("safeher_user") ||
          "null"
      );
    } catch {
      return null;
    }
  })();

  const userName =
    storedUser?.fullName?.split(" ")[0] ||
    storedUser?.name?.split(" ")[0] ||
    "there";

  // ===========================================
  // AUTHENTICATED API REQUEST
  // ===========================================

  const apiRequest = async (
    path,
    options = {}
  ) => {
    const token = localStorage.getItem(
      "safeher_token"
    );

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      throw new Error(
        "Please log in again."
      );
    }

    const response = await fetch(
      `${API}${path}`,
      {
        ...options,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

          ...options.headers,
        },
      }
    );

    if (response.status === 401) {
      localStorage.removeItem(
        "safeher_token"
      );

      localStorage.removeItem(
        "safeher_user"
      );

      navigate("/login", {
        replace: true,
      });

      throw new Error(
        "Your session has expired."
      );
    }

    const data = await response.json();

    if (
      !response.ok ||
      data.success === false
    ) {
      throw new Error(
        data.message || "Request failed."
      );
    }

    return data;
  };

  // ===========================================
  // ADD LOCAL ACTIVITY
  // ===========================================

  const addActivity = (
    title,
    description
  ) => {
    setActivity((previous) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        title,
        description,
        time: formatDate(new Date()),
      },
      ...previous,
    ]);
  };

  // ===========================================
  // LOAD DASHBOARD
  // ===========================================

  const loadDashboard = async () => {
    setDashboardLoading(true);
    setDashboardError("");

    try {
      const [
        statsData,
        activityData,
      ] = await Promise.all([
        apiRequest(
          "/api/dashboard/stats"
        ),

        apiRequest(
          "/api/activities"
        ),
      ]);

      setStats(
        statsData.stats ?? statsData
      );

      const records = Array.isArray(
        activityData
      )
        ? activityData
        : activityData.activities ??
          activityData.activity ??
          [];

      setSavedActivity(
        Array.isArray(records)
          ? records
          : []
      );
    } catch (error) {
      setDashboardError(
        error.message
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  // ===========================================
  // LOAD SAFETY CHECK-INS
  // ===========================================

  const loadCheckIns = async () => {
    const [
      activeData,
      historyData,
    ] = await Promise.all([
      apiRequest(
        "/api/checkins/active"
      ),

      apiRequest(
        "/api/checkins"
      ),
    ]);

    setCheckIn(
      activeData.checkIn ?? null
    );

    setCheckInHistory(
      historyData.checkIns ?? []
    );
  };

  const refreshCheckIns = async () => {
    setCheckInLoading(true);
    setCheckInError("");

    try {
      await loadCheckIns();
    } catch (error) {
      setCheckInError(
        error.message
      );
    } finally {
      setCheckInLoading(false);
    }
  };

  // ===========================================
  // START CHECK-IN
  // ===========================================

  const startCheckIn = async () => {
    if (
      checkIn ||
      checkInSaving ||
      checkInLoading
    ) {
      return;
    }

    setCheckInSaving(true);
    setCheckInError("");
    setCheckInSuccess("");

    try {
      const data = await apiRequest(
        "/api/checkins",
        {
          method: "POST",

          body: JSON.stringify({
            duration: Number(
              checkInMinutes
            ),
          }),
        }
      );

      setCheckIn(
        data.checkIn
      );

      setCheckInSuccess(
        "Safety check-in started successfully."
      );

      addActivity(
        "Check-In Started",
        `${checkInMinutes}-minute check-in started.`
      );

      await loadCheckIns();
    } catch (error) {
      setCheckInError(
        error.message
      );

      try {
        await loadCheckIns();
      } catch {
        // Keep original error.
      }
    } finally {
      setCheckInSaving(false);
    }
  };

  // ===========================================
  // COMPLETE CHECK-IN
  // ===========================================

  const completeCheckIn = async () => {
    if (
      !checkIn ||
      checkInSaving
    ) {
      return;
    }

    setCheckInSaving(true);
    setCheckInError("");
    setCheckInSuccess("");

    try {
      await apiRequest(
        `/api/checkins/${checkIn._id}/safe`,
        {
          method: "PATCH",
        }
      );

      setCheckIn(null);

      setCheckInSuccess(
        "You have been marked safe."
      );

      addActivity(
        "Check-In Completed",
        "You marked yourself safe."
      );

      await loadCheckIns();
    } catch (error) {
      setCheckInError(
        error.message
      );
    } finally {
      setCheckInSaving(false);
    }
  };

  // ===========================================
  // CANCEL CHECK-IN
  // ===========================================

  const cancelCheckIn = async () => {
    if (
      !checkIn ||
      checkInSaving
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Cancel this safety check-in?"
    );

    if (!confirmed) return;

    setCheckInSaving(true);
    setCheckInError("");
    setCheckInSuccess("");

    try {
      await apiRequest(
        `/api/checkins/${checkIn._id}/cancel`,
        {
          method: "PATCH",
        }
      );

      setCheckIn(null);

      setCheckInSuccess(
        "Check-in cancelled."
      );

      addActivity(
        "Check-In Cancelled",
        "You cancelled your check-in."
      );

      await loadCheckIns();
    } catch (error) {
      setCheckInError(
        error.message
      );
    } finally {
      setCheckInSaving(false);
    }
  };

  // ===========================================
  // LOCATION SHARING
  // ===========================================

  const locationLink =
    getMapsLink(location);

  const handleLocation = async () => {
    setLocationLoading(true);
    setLocationStatus("");
    setLocation(null);

    try {
      const result =
        await getBrowserLocation();

      setLocation(result);

      setLocationStatus(
        "Location obtained. Verify the map position before sharing."
      );

      addActivity(
        "Location Retrieved",
        "Browser location requested."
      );
    } catch (error) {
      setLocationStatus(
        error.message
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const copyLocation = async () => {
    if (!locationLink) return;

    try {
      await navigator.clipboard.writeText(
        locationLink
      );

      setLocationStatus(
        "Location link copied."
      );
    } catch {
      setLocationStatus(
        "Unable to copy the link."
      );
    }
  };

  const shareLocation = async () => {
    if (!locationLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Location",

          text:
            "Please verify this location:",

          url: locationLink,
        });
      } else {
        await copyLocation();
      }
    } catch (error) {
      if (
        error.name !== "AbortError"
      ) {
        setLocationStatus(
          "Sharing failed. Copy the link instead."
        );
      }
    }
  };

  // ===========================================
  // LOAD EMERGENCY HISTORY
  // ===========================================

  const loadEmergencies = async () => {
    setSOSHistoryError("");

    try {
      const data = await apiRequest(
        "/api/emergencies"
      );

      setSOSHistory(
        data.emergencies ?? []
      );
    } catch (error) {
      setSOSHistoryError(
        error.message
      );
    }
  };

  // ===========================================
  // LOAD TRUSTED CONTACTS
  // ===========================================

  const loadContacts = async () => {
    setContactError("");

    try {
      const data = await apiRequest(
        "/api/contacts"
      );

      setTrustedContacts(
        data.contacts ?? []
      );
    } catch (error) {
      setContactError(
        error.message
      );
    }
  };

  // ===========================================
  // INITIAL DATA
  // ===========================================

  useEffect(() => {
    if (
      !localStorage.getItem(
        "safeher_token"
      )
    ) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    loadDashboard();
    refreshCheckIns();
    loadEmergencies();
    loadContacts();
  }, [navigate]);

  // ===========================================
  // OPEN SOS
  // ===========================================

  const openSOS = async () => {
    setShowSOS(true);

    setSOSError("");

    setSOSLocationError("");

    setSOSLocationVerified(false);

    setSOSSaved(null);

    setSOSLocation(null);

    setSOSLoading(true);

    // Contacts can load independently.
    loadContacts();

    try {
      const result =
        await getBrowserLocation();

      setSOSLocation(result);
    } catch (error) {
      setSOSLocationError(
        `${error.message} You can still record an SOS without location.`
      );
    } finally {
      setSOSLoading(false);
    }
  };

  // ===========================================
  // RETRY SOS LOCATION
  // ===========================================

  const retrySOSLocation = async () => {
    setSOSLoading(true);

    setSOSLocationError("");

    setSOSLocationVerified(false);

    setSOSLocation(null);

    try {
      const result =
        await getBrowserLocation();

      setSOSLocation(result);
    } catch (error) {
      setSOSLocationError(
        `${error.message} You can continue without location.`
      );
    } finally {
      setSOSLoading(false);
    }
  };

  // ===========================================
  // RECORD SOS
  // ===========================================

  const recordSOS = async () => {
    if (
      sosLoading ||
      sosSaved
    ) {
      return;
    }

    if (
      sosLocation &&
      !sosLocationVerified
    ) {
      setSOSError(
        "Please verify your location or remove it before recording SOS."
      );

      return;
    }

    const confirmed = window.confirm(
      sosLocation
        ? "Record this emergency using the verified location? No messages will be sent automatically."
        : "Record this emergency without location? No messages will be sent automatically."
    );

    if (!confirmed) return;

    setSOSLoading(true);
    setSOSError("");

    try {
      const payload = {
        message:
          sosMessage.trim() ||
          "I need immediate assistance.",
      };

      if (sosLocation) {
        payload.latitude =
          sosLocation.latitude;

        payload.longitude =
          sosLocation.longitude;

        payload.accuracy =
          Number.isFinite(
            sosLocation.accuracy
          )
            ? sosLocation.accuracy
            : null;
      }

      const data = await apiRequest(
        "/api/emergencies/sos",
        {
          method: "POST",

          body: JSON.stringify(
            payload
          ),
        }
      );

      setSOSSaved(data);

      addActivity(
        "Emergency SOS Recorded",
        "SOS saved in MongoDB. No automatic alert was sent."
      );

      await Promise.allSettled([
        loadEmergencies(),
        loadDashboard(),
      ]);
    } catch (error) {
      setSOSError(
        error.message
      );
    } finally {
      setSOSLoading(false);
    }
  };

  // ===========================================
  // WHATSAPP SHARING
  // ===========================================

  const openWhatsApp = (contact) => {
    if (!sosSaved) return;

    const phone =
      normalizeWhatsAppPhone(
        contact.phone
      );

    if (!phone) {
      setSOSError(
        "This contact does not have a valid phone number."
      );

      return;
    }

    const message =
      sosSaved.alertText ||
      "SAFEHER EMERGENCY ALERT: I need assistance.";

    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ===========================================
  // COPY SOS MESSAGE
  // ===========================================

  const copySOSMessage = async () => {
    if (!sosSaved?.alertText) return;

    try {
      await navigator.clipboard.writeText(
        sosSaved.alertText
      );

      setSOSError("");
    } catch {
      setSOSError(
        "Unable to copy the emergency message."
      );
    }
  };

  // ===========================================
  // RESOLVE EMERGENCY
  // ===========================================

  const resolveEmergency = async (id) => {
    const confirmed = window.confirm(
      "Mark this emergency as resolved?"
    );

    if (!confirmed) return;

    setResolvingId(id);
    setSOSHistoryError("");

    try {
      await apiRequest(
        `/api/emergencies/${id}/resolve`,
        {
          method: "PATCH",
        }
      );

      await Promise.allSettled([
        loadEmergencies(),
        loadDashboard(),
      ]);

      addActivity(
        "Emergency Resolved",
        "An emergency record was marked resolved."
      );
    } catch (error) {
      setSOSHistoryError(
        error.message
      );
    } finally {
      setResolvingId(null);
    }
  };

  // ===========================================
  // RECENT ACTIVITY
  // ===========================================

  const recentActivity = [
    ...activity,

    ...savedActivity.map((item) => ({
      id:
        item._id ||
        item.id,

      title:
        item.title ||
        item.type ||
        "Safety Activity",

      description:
        item.description ||
        item.message ||
        item.status ||
        "",

      time: item.createdAt
        ? formatDate(
            item.createdAt
          )
        : item.time || "",
    })),
  ];

  // ===========================================
  // DASHBOARD UI
  // ===========================================

  return (
    <>
      <div className="space-y-8">

        {/* =====================================
            WELCOME BANNER
        ===================================== */}

        <section className="relative overflow-hidden rounded-[26px] bg-[#624184] px-7 py-9 text-white sm:px-10">

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
              <Heart size={15} />
              Your Safety Matters
            </div>

            <h1 className="mb-4 text-3xl font-extrabold sm:text-4xl">
              Welcome back, {userName}!
            </h1>

            <p className="max-w-xl text-sm leading-7 text-purple-100 sm:text-base">
              Stay informed, prepared and connected.
              Your personal safety tools are available
              here whenever you need them.
            </p>

          </div>
        </section>

        {/* =====================================
            DASHBOARD STATISTICS
        ===================================== */}

        {dashboardError && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {dashboardError}
          </p>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: "Trusted Contacts",

              value:
                stats?.totalContacts ??
                stats?.trustedContacts,
            },

            {
              label: "SOS Records",

              value:
                stats?.totalSOS ??
                stats?.totalEmergencies ??
                stats?.sosCount,
            },

            {
              label: "Completed Check-Ins",

              value:
                stats?.completedCheckIns ??
                stats?.safeCheckIns,
            },

            {
              label: "Missed Check-Ins",

              value:
                stats?.missedCheckIns,
            },
          ].map((item) => (

            <div
              key={item.label}
              className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm"
            >

              <p className="text-sm font-medium text-gray-500">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-extrabold text-[#624184]">
                {dashboardLoading
                  ? "..."
                  : item.value ?? "—"}
              </p>

            </div>

          ))}

        </section>

        {/* =====================================
            EMERGENCY SOS
        ===================================== */}

        <section className="rounded-[24px] border border-red-200 bg-white p-7 shadow-sm sm:p-9">

          <div className="flex flex-col items-center gap-5 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Siren size={39} />
            </div>

            <div>

              <h2 className="text-2xl font-extrabold text-[#38204F]">
                Emergency SOS
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
                Record an emergency and prepare a
                message to share with your trusted
                contacts.
              </p>

            </div>

            <button
              type="button"
              onClick={openSOS}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-red-100 hover:bg-red-700"
            >
              <Siren size={22} />
              SOS — Get Help
            </button>

            <p className="text-xs font-medium text-red-600">
              Messages are not sent automatically.
              WhatsApp requires manual confirmation.
            </p>

          </div>

        </section>

        {/* =====================================
            SAFETY TOOLS
        ===================================== */}

        <section>

          <div className="mb-6">

            <h2 className="text-xl font-bold sm:text-2xl">
              Your Safety Tools
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Access important safety features
              from one place.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* =================================
                LOCATION SHARING
            ================================= */}

            <div className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F1E8F8] text-[#6E4A91]">
                <MapPin size={27} />
              </div>

              <h3 className="text-xl font-bold">
                Share My Location
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Retrieve your browser-estimated
                location and share it with someone
                you trust.
              </p>

              <button
                type="button"
                onClick={handleLocation}
                disabled={locationLoading}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#563775] disabled:opacity-60"
              >
                <MapPin size={18} />

                {locationLoading
                  ? "Getting Location..."
                  : "Get My Location"}
              </button>

              {locationStatus && (
                <p
                  role="status"
                  className="mt-4 text-sm text-gray-600"
                >
                  {locationStatus}
                </p>
              )}

              {location && (

                <div className="mt-5 space-y-3 rounded-xl bg-[#F9F7FC] p-4">

                  <p className="text-xs text-gray-600">
                    Reported accuracy: ±
                    {Math.round(
                      location.accuracy || 0
                    )} metres
                  </p>

                  <p className="text-xs font-medium text-amber-700">
                    Verify your map position before
                    sharing. Your browser may report
                    an incorrect location.
                  </p>

                  <p className="break-all text-xs text-gray-600">
                    {locationLink}
                  </p>

                  <a
                    href={locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#6E4A91] underline"
                  >
                    <ExternalLink size={15} />
                    Verify on Google Maps
                  </a>

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={copyLocation}
                      className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2 text-xs font-semibold text-[#6E4A91]"
                    >
                      <Copy size={15} />
                      Copy Link
                    </button>

                    <button
                      type="button"
                      onClick={shareLocation}
                      className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-4 py-2 text-xs font-semibold text-[#6E4A91]"
                    >
                      <ExternalLink size={15} />
                      Share Link
                    </button>

                  </div>

                </div>

              )}

            </div>

            {/* =================================
                TRUSTED CONTACTS
            ================================= */}

            <div className="flex flex-col rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FCECF1] text-[#C16B8B]">
                <Users size={27} />
              </div>

              <h3 className="text-xl font-bold">
                Trusted Contacts
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Build your safety network by keeping
                contact details of family and friends.
              </p>

              <Link
                to="/dashboard/contacts"
                className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#6E4A91] hover:underline"
              >
                Manage Trusted Contacts

                <ArrowRight size={18} />
              </Link>

            </div>

            {/* =================================
                SAFETY CHECK-IN
            ================================= */}

            <div className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF4F1] text-[#468E82]">
                <Clock3 size={27} />
              </div>

              <h3 className="text-xl font-bold">
                Safety Check-In
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Schedule a safety check-in and
                confirm you're safe before the deadline.
              </p>

              {checkInError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {checkInError}
                </p>
              )}

              {checkInSuccess && (
                <p
                  role="status"
                  className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >
                  {checkInSuccess}
                </p>
              )}

              {checkInLoading ? (

                <p className="mt-6 text-sm text-gray-500">
                  Loading your check-in...
                </p>

              ) : !checkIn ? (

                <div className="mt-6 space-y-4">

                  <label
                    htmlFor="checkin-time"
                    className="block text-sm font-semibold"
                  >
                    Check-in duration
                  </label>

                  <select
                    id="checkin-time"
                    value={checkInMinutes}
                    onChange={(e) =>
                      setCheckInMinutes(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#8B5BAA]"
                  >
                    <option value="15">
                      15 minutes
                    </option>

                    <option value="30">
                      30 minutes
                    </option>

                    <option value="60">
                      1 hour
                    </option>

                    <option value="120">
                      2 hours
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={startCheckIn}
                    disabled={
                      checkInSaving ||
                      checkInLoading
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6E4A91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#563775] disabled:opacity-60"
                  >
                    <Plus size={18} />

                    {checkInSaving
                      ? "Starting..."
                      : "Start Check-In"}
                  </button>

                  {checkInError && (
                    <button
                      type="button"
                      onClick={refreshCheckIns}
                      className="block text-sm font-semibold text-[#6E4A91] underline"
                    >
                      Retry loading
                    </button>
                  )}

                </div>

              ) : (

                <div className="mt-6 rounded-xl bg-[#EAF4F1] p-5">

                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#468E82]">
                    <CheckCircle2 size={19} />
                    Active Check-In
                  </div>

                  <p className="text-sm text-gray-600">
                    Your check-in deadline:
                  </p>

                  <p className="mt-2 font-bold">
                    {formatDate(
                      checkIn.deadline
                    )}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    Duration: {checkIn.duration} minutes
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={completeCheckIn}
                      disabled={checkInSaving}
                      className="rounded-xl bg-[#468E82] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Mark Myself Safe
                    </button>

                    <button
                      type="button"
                      onClick={cancelCheckIn}
                      disabled={checkInSaving}
                      className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 disabled:opacity-60"
                    >
                      Cancel Check-In
                    </button>

                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Automatic missed-check-in alerts
                    are not enabled.
                  </p>

                </div>

              )}

              {/* CHECK-IN HISTORY */}

              <div className="mt-6 border-t border-gray-100 pt-5">

                <h4 className="mb-3 text-sm font-bold">
                  Recent Check-Ins
                </h4>

                {checkInHistory.length === 0 ? (

                  <p className="text-sm text-gray-500">
                    No check-in history yet.
                  </p>

                ) : (

                  <div className="space-y-3">

                    {checkInHistory
                      .slice(0, 5)
                      .map((item) => (

                        <div
                          key={item._id}
                          className="flex items-center justify-between gap-3 rounded-lg bg-[#F9F7FC] px-3 py-3 text-xs"
                        >

                          <span className="text-gray-600">
                            {item.duration} min ·{" "}
                            {formatDate(
                              item.startTime
                            )}
                          </span>

                          <span className="font-bold text-[#6E4A91]">
                            {item.status}
                          </span>

                        </div>

                      ))}

                  </div>

                )}

              </div>

            </div>

            {/* =================================
                SAFETY TIPS
            ================================= */}

            <div className="flex flex-col rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFF3E6] text-[#C38A4A]">
                <BookOpen size={27} />
              </div>

              <h3 className="text-xl font-bold">
                Safety Tips
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Explore practical safety guidance
                for travelling, staying aware of your
                surroundings, and protecting yourself
                online.
              </p>

              <Link
                to="/safety-tips"
                className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#6E4A91] hover:underline"
              >
                Explore Safety Tips

                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </section>

        {/* =====================================
            EMERGENCY HISTORY
        ===================================== */}

        <section className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Siren size={23} />
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Emergency History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your recorded SOS emergencies.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={loadEmergencies}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E4A91]"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>

          {sosHistoryError && (
            <p
              role="alert"
              className="mb-4 text-sm text-red-600"
            >
              {sosHistoryError}
            </p>
          )}

          {sosHistory.length === 0 ? (

            <p className="rounded-xl border border-dashed border-[#E5D9ED] p-8 text-center text-sm text-gray-500">
              No emergency records yet.
            </p>

          ) : (

            <div className="space-y-4">

              {sosHistory
                .slice(0, 10)
                .map((item) => {

                  const mapsLink =
                    getMapsLink(
                      item.location
                    );

                  return (

                    <div
                      key={item._id}
                      className="rounded-xl border border-gray-100 p-4"
                    >

                      <div className="flex flex-wrap items-center justify-between gap-2">

                        <p className="text-sm font-bold">
                          {formatDate(
                            item.createdAt
                          )}
                        </p>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "ACTIVE"
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {item.status}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-gray-600">
                        {item.message}
                      </p>

                      <div className="mt-3 flex items-start gap-2">

                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-[#6E4A91]"
                        />

                        <p className="text-xs leading-6 text-gray-600">
                          {item.location?.address ||
                            "Address not available for this record"}
                        </p>

                      </div>

                      <div className="mt-4 flex flex-wrap gap-4">

                        {mapsLink && (

                          <a
                            href={mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-[#6E4A91] underline"
                          >
                            View recorded location
                          </a>

                        )}

                        {item.status === "ACTIVE" && (

                          <button
                            type="button"
                            onClick={() =>
                              resolveEmergency(
                                item._id
                              )
                            }
                            disabled={
                              resolvingId ===
                              item._id
                            }
                            className="text-xs font-semibold text-green-700 underline disabled:opacity-60"
                          >
                            {resolvingId ===
                            item._id
                              ? "Resolving..."
                              : "Mark Resolved"}
                          </button>

                        )}

                      </div>

                    </div>

                  );
                })}

            </div>

          )}

        </section>

        {/* =====================================
            RECENT ACTIVITY
        ===================================== */}

        <section className="rounded-2xl border border-[#EEE6F3] bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-7 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1E8F8] text-[#6E4A91]">
              <Activity size={23} />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Recent Safety Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Saved activity and actions from
                this session.
              </p>

            </div>

          </div>

          {dashboardLoading ? (

            <p className="text-sm text-gray-500">
              Loading activity...
            </p>

          ) : recentActivity.length === 0 ? (

            <div className="rounded-xl border border-dashed border-[#E5D9ED] px-5 py-10 text-center">

              <Clock3
                size={32}
                className="mx-auto mb-4 text-[#B69BC9]"
              />

              <h3 className="text-sm font-bold">
                No Recent Activity
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Your dashboard activity will
                appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {recentActivity.map(
                (item, index) => (

                  <div
                    key={
                      item.id ||
                      index
                    }
                    className="flex gap-4 rounded-xl border border-gray-100 p-4"
                  >

                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1E8F8] text-[#6E4A91]">

                      <CheckCircle2 size={18} />

                    </div>

                    <div>

                      <h3 className="text-sm font-bold">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.description}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {item.time}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* =====================================
            SAFETY DISCLAIMER
        ===================================== */}

        <div className="flex items-start gap-3 rounded-xl bg-[#F1E8F8] p-5">

          <ShieldCheck
            size={20}
            className="mt-1 shrink-0 text-[#6E4A91]"
          />

          <p className="text-xs leading-6 text-[#655574]">
            SafeHer is currently a development prototype.
            SOS records can be saved, but automatic
            emergency notifications and missed-check-in
            alerts are not active. WhatsApp sharing
            requires manual sending. Browser location
            and readable addresses may be inaccurate.
            In an emergency, contact local emergency
            services directly.
          </p>

        </div>

      </div>

      {/* =======================================
          EMERGENCY SOS MODAL
      ======================================= */}

      {showSOS && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6">

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-dialog-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl sm:p-8"
          >

            {/* MODAL HEADER */}

            <div className="mb-5 flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle size={28} />
                </div>

                <div>

                  <h2
                    id="sos-dialog-title"
                    className="text-xl font-extrabold text-[#38204F]"
                  >
                    Emergency SOS
                  </h2>

                  <p className="text-xs text-gray-500">
                    Record an emergency and prepare
                    a message.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSOS(false)
                }
                aria-label="Close SOS dialog"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* SOS ERROR */}

            {sosError && (

              <p
                role="alert"
                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {sosError}
              </p>

            )}

            {!sosSaved ? (

              <>

                {/* EMERGENCY MESSAGE */}

                <label
                  htmlFor="sos-message"
                  className="block text-sm font-semibold"
                >
                  Emergency Message
                </label>

                <textarea
                  id="sos-message"
                  value={sosMessage}
                  onChange={(e) =>
                    setSOSMessage(
                      e.target.value
                    )
                  }
                  maxLength={500}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#8B5BAA]"
                />

                {/* LOCATION PANEL */}

                <div className="mt-5 rounded-xl bg-[#F9F7FC] p-4">

                  <div className="flex items-center gap-2">

                    <MapPin
                      size={20}
                      className="text-[#6E4A91]"
                    />

                    <h3 className="text-sm font-bold text-[#38204F]">
                      Emergency Location
                    </h3>

                  </div>

                  {sosLoading ? (

                    <p className="mt-3 text-sm text-gray-500">
                      Processing your location...
                    </p>

                  ) : sosLocation ? (

                    <div className="mt-4 space-y-4">

                      <div className="rounded-xl border border-purple-100 bg-white p-4">

                        <p className="text-xs font-semibold text-gray-500">
                          Browser-estimated location
                        </p>

                        <p className="mt-2 text-sm font-medium text-[#38204F]">
                          Verify your location using
                          the map below. The readable
                          address will be displayed
                          after recording your SOS.
                        </p>

                        <p className="mt-3 text-xs text-gray-500">
                          Reported accuracy: ±
                          {Math.round(
                            sosLocation.accuracy || 0
                          )} metres
                        </p>

                      </div>

                      <a
                        href={getMapsLink(
                          sosLocation
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E4A91] underline"
                      >
                        <ExternalLink size={16} />
                        Verify Location on Google Maps
                      </a>

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <p className="text-xs leading-6 text-amber-800">
                          Browser location may be
                          incorrect. Confirm that
                          Google Maps shows your
                          actual location before
                          using it in an emergency.
                        </p>

                      </div>

                      <label className="flex cursor-pointer items-start gap-3">

                        <input
                          type="checkbox"
                          checked={
                            sosLocationVerified
                          }
                          onChange={(e) =>
                            setSOSLocationVerified(
                              e.target.checked
                            )
                          }
                          className="mt-1 h-4 w-4 accent-[#6E4A91]"
                        />

                        <span className="text-xs leading-6 text-gray-700">
                          I have checked the map
                          and confirmed this location
                          is correct.
                        </span>

                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setSOSLocation(null);

                          setSOSLocationVerified(
                            false
                          );

                          setSOSLocationError(
                            "Location removed. You can still record your emergency."
                          );
                        }}
                        className="text-xs font-semibold text-red-600 underline"
                      >
                        Location is incorrect —
                        continue without it
                      </button>

                    </div>

                  ) : (

                    <div className="mt-4 space-y-3">

                      <p className="text-sm text-gray-600">
                        Your location is unavailable.
                        You can still record an SOS
                        without coordinates.
                      </p>

                      <button
                        type="button"
                        onClick={retrySOSLocation}
                        disabled={sosLoading}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E4A91] underline"
                      >
                        <RefreshCw size={15} />
                        Retry Location
                      </button>

                    </div>

                  )}

                  {sosLocationError && (

                    <p
                      role="status"
                      className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800"
                    >
                      {sosLocationError}
                    </p>

                  )}

                </div>

                {/* RECORD SOS INFORMATION */}

                <p className="mt-4 text-xs leading-6 text-gray-500">
                  Recording an SOS saves it in
                  MongoDB. It does not automatically
                  notify trusted contacts.
                </p>

                {/* RECORD BUTTON */}

                <div className="mt-6 flex flex-col gap-3">

                  <button
                    type="button"
                    onClick={recordSOS}
                    disabled={
                      sosLoading ||
                      (Boolean(
                        sosLocation
                      ) &&
                        !sosLocationVerified)
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {sosLoading
                      ? "Processing..."
                      : "Record SOS"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowSOS(false)
                    }
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
                  >
                    Close
                  </button>

                </div>

              </>

            ) : (

              <>

                {/* SOS SUCCESS */}

                <div className="rounded-xl bg-green-50 p-4">

                  <div className="flex items-center gap-2 text-sm font-bold text-green-700">

                    <CheckCircle2 size={19} />

                    SOS Recorded Successfully

                  </div>

                  <p className="mt-2 text-xs leading-6 text-green-800">
                    Your emergency was saved in
                    MongoDB. No automatic
                    notification has been sent.
                  </p>

                </div>

                {/* READABLE ADDRESS */}

                <div className="mt-5 rounded-xl border border-purple-100 bg-[#F9F7FC] p-4">

                  <div className="flex items-center gap-2">

                    <MapPin
                      size={19}
                      className="text-[#6E4A91]"
                    />

                    <h3 className="text-sm font-bold text-[#38204F]">
                      Recorded Emergency Location
                    </h3>

                  </div>

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    {sosSaved.readableAddress ||
                      sosSaved.emergency?.location
                        ?.address ||
                      "Location unavailable"}
                  </p>

                  {sosSaved.mapsLink && (

                    <a
                      href={
                        sosSaved.mapsLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#6E4A91] underline"
                    >
                      <ExternalLink size={15} />
                      View Recorded Location
                    </a>

                  )}

                  <p className="mt-3 text-xs leading-5 text-amber-700">
                    This address is estimated from
                    browser coordinates. Verify it
                    before sharing.
                  </p>

                </div>

                {/* TRUSTED CONTACTS */}

                <h3 className="mt-6 text-sm font-bold">
                  Share with Trusted Contacts
                </h3>

                <p className="mt-2 text-xs leading-6 text-gray-500">
                  Select a trusted contact to open
                  WhatsApp with your prepared
                  emergency message. You must
                  press Send in WhatsApp yourself.
                </p>

                {contactError && (

                  <p className="mt-3 text-xs text-red-600">
                    {contactError}
                  </p>

                )}

                {trustedContacts.length === 0 ? (

                  <div className="mt-4 rounded-xl bg-[#F9F7FC] p-4">

                    <p className="text-sm text-gray-500">
                      No trusted contacts available.
                    </p>

                    <Link
                      to="/dashboard/contacts"
                      onClick={() =>
                        setShowSOS(false)
                      }
                      className="mt-2 inline-block text-sm font-semibold text-[#6E4A91] underline"
                    >
                      Manage Trusted Contacts
                    </Link>

                  </div>

                ) : (

                  <div className="mt-4 space-y-3">

                    {trustedContacts.map(
                      (contact) => (

                        <div
                          key={
                            contact._id
                          }
                          className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3"
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold">
                              {contact.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {contact.phone}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openWhatsApp(
                                contact
                              )
                            }
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                          >
                            <MessageCircle
                              size={15}
                            />
                            WhatsApp
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

                {/* COPY MESSAGE */}

                <button
                  type="button"
                  onClick={
                    copySOSMessage
                  }
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6E4A91]"
                >
                  <Copy size={16} />
                  Copy Emergency Message
                </button>

                {/* CLOSE MODAL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowSOS(false)
                  }
                  className="mt-6 w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600"
                >
                  Close
                </button>

              </>

            )}

            {/* SAFETY NOTE */}

            <p className="mt-5 text-center text-xs text-gray-400">
              If you're in immediate danger,
              contact emergency services directly.
            </p>

          </div>

        </div>

      )}

    </>
  );
};

export default Dashboard;
