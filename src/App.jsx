
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import { LogIn } from "lucide-react";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import Dashboard from "./components/pages/dashboard";
import Contacts from "./components/pages/contacts";
import Settings from "./components/pages/settings";
import DashboardLayout from "./components/pages/dashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
    

         <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
