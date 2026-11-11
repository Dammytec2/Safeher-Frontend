
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

// ============================================
// API CONFIGURATION
// ============================================

const API_URL = "http://localhost:5000";

// ============================================
// GET STORED USER
// ============================================

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(
      "safeher_user"
    );

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// ============================================
// DASHBOARD LAYOUT
// ============================================

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // STATES
  // ==========================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [user, setUser] = useState(
    getStoredUser
  );

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [userError, setUserError] =
    useState("");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("safeher_token");
    localStorage.removeItem("safeher_user");

    setUser(null);
    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // LOAD PROFILE FROM BACKEND
  // ==========================================

  const loadUserProfile = async () => {
    const token = localStorage.getItem(
      "safeher_token"
    );

    if (!token) {
      handleLogout();
      return;
    }

    setLoadingUser(true);
    setUserError("");

    try {
      const response = await fetch(
        `${API_URL}/api/users/profile`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from server."
        );
      }

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to retrieve profile."
        );
      }

      const profile = data.user;

      setUser(profile);

      localStorage.setItem(
        "safeher_user",
        JSON.stringify(profile)
      );
    } catch (error) {
      setUserError(error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // ==========================================
  // LOAD USER ON MOUNT
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem(
      "safeher_token"
    );

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    loadUserProfile();
  }, [navigate]);

  // ==========================================
  // UPDATE USER AFTER SETTINGS CHANGES
  // ==========================================

  useEffect(() => {
    const handleProfileUpdated = () => {
      const updatedUser = getStoredUser();

      if (updatedUser) {
        setUser(updatedUser);
      }
    };

    window.addEventListener(
      "safeher-profile-updated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "safeher-profile-updated",
        handleProfileUpdated
      );
    };
  }, []);

  // ==========================================
  // CLOSE SIDEBAR WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // ==========================================
  // USER DISPLAY INFORMATION
  // ==========================================

  const fullName =
    user?.fullName ||
    user?.name ||
    "SafeHer User";

  const email =
    user?.email ||
    "Email unavailable";

  const firstName =
    fullName.trim().split(/\s+/)[0] ||
    "User";

  const userInitial =
    fullName.trim().charAt(0).toUpperCase() ||
    "U";

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigation = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      path: "/dashboard",
      end: true,
    },
    {
      title: "Trusted Contacts",
      icon: Users,
      path: "/dashboard/contacts",
    },
    {
      title: "Profile & Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  const pageTitles = {
    "/dashboard": "Safety Dashboard",
    "/dashboard/contacts": "Trusted Contacts",
    "/dashboard/settings": "Profile & Settings",
  };

  const pageTitle =
    pageTitles[location.pathname] ||
    "SafeHer Dashboard";

  // ==========================================
  // DATE
  // ==========================================

  const today = new Date().toLocaleDateString(
    "en-NG",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F9F7FC] text-[#38204F]">

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#EEE6F3] bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* LOGO */}

        <div className="flex h-24 items-center justify-between border-b border-[#F0EAF5] px-7">

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6E4A91] text-white">
              <ShieldCheck size={24} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              SafeHer
              <span className="text-[#B78AC9]">
                .
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="lg:hidden"
          >
            <X size={23} />
          </button>

        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <div className="flex-1 overflow-y-auto px-4 py-8">

          <p className="mb-5 px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-2">

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#F1E8F8] text-[#6E4A91]"
                        : "text-gray-500 hover:bg-[#F9F6FC] hover:text-[#6E4A91]"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.title}
                </NavLink>
              );
            })}

          </nav>

          {/* =================================
              RESOURCES
          ================================= */}

          <div className="mt-10 border-t border-gray-100 pt-7">

            <p className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Resources
            </p>

            <Link
              to="/safety-tips"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-500 transition hover:bg-[#F9F6FC] hover:text-[#6E4A91]"
            >
              <BookOpen size={20} />
              Safety Tips
            </Link>

          </div>

        </div>

        {/* =====================================
            SIDEBAR FOOTER
        ===================================== */}

        <div className="border-t border-[#F0EAF5] p-5">

          {/* USER PROFILE */}

          <Link
            to="/dashboard/settings"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="mb-4 flex items-center gap-3 rounded-xl bg-[#F9F7FC] p-3 transition hover:bg-[#F1E8F8]"
          >

            {/* AVATAR */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EADCF4] font-bold text-[#6E4A91]">
              {userInitial}
            </div>

            {/* USER DETAILS */}

            <div className="min-w-0">

              <p className="truncate text-sm font-bold">
                {loadingUser && !user
                  ? "Loading..."
                  : fullName}
              </p>

              <p className="truncate text-xs text-gray-500">
                {loadingUser && !user
                  ? "Please wait..."
                  : email}
              </p>

            </div>

          </Link>

          {/* PROFILE ERROR */}

          {userError && (
            <div className="mb-4 rounded-xl bg-red-50 p-3">

              <p className="text-xs leading-5 text-red-600">
                {userError}
              </p>

              <button
                type="button"
                onClick={loadUserProfile}
                className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-red-700 underline"
              >
                <RefreshCw size={13} />
                Retry
              </button>

            </div>
          )}

          {/* LOG OUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={19} />
            Log Out
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN AREA
      ===================================== */}

      <div className="min-h-screen lg:ml-[270px]">

        {/* =====================================
            TOP NAVIGATION
        ===================================== */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#EEE6F3] bg-white px-5 sm:px-8 lg:px-10">

          {/* LEFT SIDE */}

          <div className="flex items-center gap-4">

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
              className="lg:hidden"
            >
              <Menu size={25} />
            </button>

            {/* PAGE TITLE */}

            <div>

              <h2 className="text-lg font-bold sm:text-xl">
                {pageTitle}
              </h2>

              <p className="mt-1 hidden text-xs text-gray-500 sm:block">
                Your personal safety space
              </p>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">

            {/* DATE */}

            <div className="hidden items-center gap-2 text-sm text-gray-500 md:flex">
              <CalendarDays size={17} />
              {today}
            </div>

            {/* USER AVATAR */}

            <Link
              to="/dashboard/settings"
              aria-label={`Open settings for ${firstName}`}
              title={fullName}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EADCF4] font-bold text-[#6E4A91] transition hover:bg-[#DCC9EB]"
            >
              {userInitial}
            </Link>

          </div>

        </header>

        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

          <Outlet />

        </main>

        {/* =====================================
            FOOTER
        ===================================== */}

        <footer className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">

          <div className="border-t border-[#EEE6F3] pt-6 text-xs text-gray-400">
            © {new Date().getFullYear()} SafeHer.
            All rights reserved.
          </div>

        </footer>

      </div>

    </div>
  );
};

export default DashboardLayout;
