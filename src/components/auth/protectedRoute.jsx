
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";

const API_URL = "http://localhost:5000";

const ProtectedRoute = () => {
  const location = useLocation();

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();

    const verifySession = async () => {
      const token = localStorage.getItem("safeher_token");

      if (!token) {
        setStatus("unauthorized");
        return;
      }

      setStatus("checking");

      try {
        const response = await fetch(
          `${API_URL}/api/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("safeher_token");
          localStorage.removeItem("safeher_user");

          setStatus("unauthorized");
          return;
        }

        if (!response.ok) {
          setStatus("error");
          return;
        }

        const data = await response.json();

        if (!data.success || !data.user) {
          setStatus("error");
          return;
        }

        localStorage.setItem(
          "safeher_user",
          JSON.stringify(data.user)
        );

        setStatus("authorized");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("error");
        }
      }
    };

    verifySession();

    return () => controller.abort();
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7FC]">
        <ShieldCheck
          size={42}
          className="text-[#6E4A91]"
        />

        <Loader2
          size={28}
          className="mt-5 animate-spin text-[#6E4A91]"
        />

        <p className="mt-4 text-sm font-semibold text-[#38204F]">
          Verifying your SafeHer account...
        </p>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F7FC] px-6 text-center">
        <ShieldCheck
          size={42}
          className="text-[#6E4A91]"
        />

        <h2 className="mt-5 text-xl font-bold text-[#38204F]">
          Unable to Verify Your Session
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
          We couldn't contact the SafeHer server.
          Your account has not been logged out.
          Please check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-[#6E4A91] px-6 py-3 text-sm font-semibold text-white hover:bg-[#563775]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
