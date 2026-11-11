
import { useState } from "react";
import { Home, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // LOGIN USER THROUGH BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Confirm backend returned required authentication data
      if (!data.token || !data.user) {
        throw new Error(
          "Login response is incomplete. Please try again."
        );
      }

      // Store authentication details
      localStorage.setItem("safeher_token", data.token);

      localStorage.setItem(
        "safeher_user",
        JSON.stringify(data.user)
      );

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login error:", err.message);

      setError(
        err instanceof TypeError
          ? "Unable to connect to the server. Please check that your backend is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8D5F5] via-[#F3E8FA] to-[#C3A2E8] p-4 md:p-8">

      {/* Main Card Container */}
      <div className="flex min-h-[700px] w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:flex-row">

        {/* LEFT PANEL - Image & Branding */}
        <div className="relative hidden w-1/2 overflow-hidden bg-[#7B4AE2] lg:block">

          <img
            src="/hero-woman.jpg"
            alt="SafeHer"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[#7B4AE2]/40 mix-blend-color" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#7B4AE2]/60 via-transparent to-transparent mix-blend-multiply" />
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="relative flex w-full flex-col items-center justify-center p-8 sm:p-12 lg:w-1/2 lg:p-16">

          {/* Go Home */}
          <Link
            to="/"
            className="absolute right-8 top-8 flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
          >
            <Home size={14} />
            Go to Home
          </Link>

          <div className="mt-8 w-full max-w-[360px]">

            {/* Logo */}
            <div className="mb-10 flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7B4AE2] text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12C4 7.58172 7.58172 4 12 4H20V12C20 16.4183 16.4183 20 12 20H4V12Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="text-xl font-bold text-gray-900">
                Safeher
              </span>
            </div>

            {/* Headers */}
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                Sign in to your account.
              </h2>

              <p className="text-sm text-gray-500">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#7B4AE2] focus:ring-2 focus:ring-[#7B4AE2]/20"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-[#7B4AE2] focus:ring-2 focus:ring-[#7B4AE2]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#7B4AE2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6835cb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Google Sign In */}
            <div className="mt-4">
              <button
                type="button"
                disabled
                title="Google sign-in is not available yet"
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-400 opacity-60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google (Coming soon)
              </button>
            </div>

            {/* Footer Link */}
            <p className="mt-12 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#7B4AE2] hover:underline"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
