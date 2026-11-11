
import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Safety Tips", path: "/safety-tips" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6E4A91] text-white">
            <ShieldCheck size={24} strokeWidth={2} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-[#38204F]">
            SafeHer<span className="text-[#B78AC9]">.</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#6E4A91]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-6 md:flex">
          <a
            href="/login"
            className="text-sm font-semibold text-[#38204F] transition hover:text-[#6E4A91]"
          >
            Log In
          </a>

          <a
            href="/register"
            className="rounded-xl bg-[#6E4A91] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#563775]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="text-[#38204F] md:hidden"
        >
          {menuOpen ? <X size={27} /> : <Menu size={27} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="flex flex-col gap-5 border-t border-purple-100 bg-white px-6 py-6 shadow-lg md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-[#6E4A91]"
            >
              {link.name}
            </a>
          ))}

          <div className="mt-2 flex flex-col gap-4 border-t border-gray-100 pt-5">
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-[#38204F]"
            >
              Log In
            </a>

            <a
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#6E4A91] px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Get Started
            </a>
          </div>
        </nav>
      )}
    </header>
  
  );
};

export default Navbar;
