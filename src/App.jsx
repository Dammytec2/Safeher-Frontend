
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// PUBLIC PAGES
import Home from "./components/pages/home";
import Login from "./components/pages/login";
import Register from "./components/pages/register";

// DASHBOARD PAGES
import Dashboard from "./components/pages/dashboard";
import Contacts from "./components/pages/contacts";
import Settings from "./components/pages/settings";
import DashboardLayout from "./components/pages/dashboardLayout";
import ProtectedRoute from "./components/auth/protectedRoute";

// AUTHENTICATION PROTECTION



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<DashboardLayout />}
          >

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="contacts"
              element={<Contacts />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>

        {/* =========================
            UNKNOWN ROUTES
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
