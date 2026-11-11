
import Navbar from "../shared/navbar";
import {
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Users,
  BookOpen,
  UserRound,
  CheckCircle2,
  Heart,
  Lightbulb,
  MapPin,
  Smartphone,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Practical Safety Tips",
      description:
        "Explore helpful safety advice for everyday situations, travelling, online activities, and personal wellbeing.",
      bg: "bg-[#F2EAF8]",
      color: "text-[#76519B]",
    },
    {
      icon: Users,
      title: "Trusted Contacts",
      description:
        "Keep important contact information for family members, friends, and people you trust in one convenient place.",
      bg: "bg-[#FCECF1]",
      color: "text-[#C16B8B]",
    },
    {
      icon: UserRound,
      title: "Personal Dashboard",
      description:
        "Access your personal safety information, manage trusted contacts, and keep your profile organised.",
      bg: "bg-[#EBF4F2]",
      color: "text-[#468E82]",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up in a few simple steps to access your personal SafeHer dashboard.",
      icon: UserRound,
    },
    {
      number: "02",
      title: "Add Trusted Contacts",
      description:
        "Save the contact details of people you trust and may need to reach during an emergency.",
      icon: Users,
    },
    {
      number: "03",
      title: "Stay Safety-Aware",
      description:
        "Explore useful safety tips and manage your important information in one place.",
      icon: ShieldCheck,
    },
  ];

  const safetyTips = [
    {
      icon: MapPin,
      title: "Stay Aware of Your Surroundings",
      description:
        "Pay attention to your environment, especially when visiting unfamiliar places.",
    },
    {
      icon: Smartphone,
      title: "Keep Your Phone Accessible",
      description:
        "Keep your phone charged and important contact numbers easy to find.",
    },
    {
      icon: HeartHandshake,
      title: "Stay Connected",
      description:
        "Let someone you trust know your plans when travelling or visiting unfamiliar places.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#38204F]">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#FCF9FF] to-[#F3EAF9]">
          <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-12 lg:py-24">

            {/* LEFT SIDE */}
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-medium text-[#6E4A91] shadow-sm">
                <ShieldCheck size={17} />
                Your Safety, Our Priority
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-[#38204F] sm:text-5xl lg:text-[60px]">
                Feel Safer.
                <br />
                Stay Confident.
                <br />
                <span className="text-[#8B5BAA]">
                  Live Fearlessly.
                </span>
              </h1>

              <p className="mb-9 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
                Every woman deserves to feel safe and empowered.
                SafeHer provides helpful safety resources,
                practical tips, and a simple way to manage
                the people you trust.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#6E4A91] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-200/60 transition hover:bg-[#563775]"
                >
                  Get Started
                  <ArrowRight size={18} />
                </a>

                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-[#D9C8E6] bg-white px-7 py-4 text-sm font-semibold text-[#6E4A91] transition hover:border-[#6E4A91]"
                >
                  Learn More
                </a>
              </div>

              <div className="mt-10 flex items-center gap-3 text-sm text-gray-500">
                <HeartHandshake
                  size={22}
                  className="text-[#8B5BAA]"
                />
                <span>
                  Supporting women's safety and awareness.
                </span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative mx-auto w-full max-w-[530px]">
              <div className="absolute -right-5 -top-5 h-44 w-44 rounded-full bg-[#E8D6F3] blur-3xl" />
              <div className="absolute -bottom-6 -left-5 h-48 w-48 rounded-full bg-[#DCC7EC] blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border-[8px] border-white bg-[#EEE3F6] shadow-2xl shadow-purple-200/50">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
                  alt="Confident woman representing safety and empowerment"
                  className="h-[350px] w-full object-cover object-center sm:h-[470px] lg:h-[520px]"
                />
              </div>

              <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 shadow-xl sm:-left-6 sm:px-5 sm:py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0E6F7] text-[#6E4A91]">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#38204F]">
                    Your Safety Matters
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Awareness. Confidence. Support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT SAFEHER ================= */}
        <section className="bg-white px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">

            {/* IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-[30px] bg-[#F4EDF8]">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85"
                  alt="Friends spending time together"
                  loading="lazy"
                  className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[490px]"
                />
              </div>

              <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-5 py-4 shadow-xl sm:right-[-15px]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2EAF8] text-[#6E4A91]">
                  <Heart size={23} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#38204F]">
                    Empowering Women
                  </p>
                  <p className="text-xs text-gray-500">
                    Through safety awareness
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="pt-6 lg:pt-0">
              <span className="mb-5 inline-block text-sm font-bold uppercase tracking-[0.18em] text-[#8B5BAA]">
                About SafeHer
              </span>

              <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[#38204F] sm:text-4xl lg:text-5xl">
                Because Every Woman
                <span className="text-[#8B5BAA]"> Deserves to Feel Safe.</span>
              </h2>

              <p className="mb-5 text-base leading-8 text-gray-600">
                At SafeHer, we believe that feeling safe should
                never be a privilege. Every woman deserves access
                to information, support, and resources that help
                her make informed decisions about her personal safety.
              </p>

              <p className="mb-7 text-base leading-8 text-gray-600">
                Our platform brings together practical safety
                advice and simple tools for organising trusted
                contacts, helping women feel more prepared and
                connected in their everyday lives.
              </p>

              <div className="mb-9 space-y-4">
                {[
                  "Promoting personal safety awareness",
                  "Encouraging confidence and preparedness",
                  "Making helpful resources easy to access",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={21}
                      className="shrink-0 text-[#8B5BAA]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="/about"
                className="inline-flex items-center gap-3 rounded-xl bg-[#6E4A91] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#563775]"
              >
                Discover Our Story
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* ================= OUR FEATURES ================= */}
        <section className="bg-[#FAF7FC] px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.18em] text-[#8B5BAA]">
                What We Offer
              </span>

              <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-[#38204F] sm:text-4xl lg:text-5xl">
                Your Safety, Made Simpler.
              </h2>

              <p className="text-base leading-8 text-gray-600">
                Explore the simple tools and helpful resources
                designed to support your personal safety journey.
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[24px] border border-[#EEE6F3] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/60"
                  >
                    <div className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
                      <Icon size={29} strokeWidth={1.8} />
                    </div>

                    <h3 className="mb-4 text-xl font-bold text-[#38204F]">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-7 text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="bg-white px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.18em] text-[#8B5BAA]">
                Simple & Easy
              </span>

              <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-[#38204F] sm:text-4xl lg:text-5xl">
                How SafeHer Works
              </h2>

              <p className="text-base leading-8 text-gray-600">
                Getting started with SafeHer is simple.
                Just follow these three easy steps.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative text-center"
                  >
                    <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#F2EAF8] text-[#6E4A91]">
                      <Icon size={36} strokeWidth={1.7} />

                      <span className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#6E4A91] text-xs font-bold text-white">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mb-4 text-xl font-bold text-[#38204F]">
                      {step.title}
                    </h3>

                    <p className="mx-auto max-w-xs text-sm leading-7 text-gray-600">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SAFETY AWARENESS ================= */}
        <section className="bg-[#F7F1FA] px-6 py-20 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">

            {/* CONTENT */}
            <div>
              <span className="mb-5 inline-block text-sm font-bold uppercase tracking-[0.18em] text-[#8B5BAA]">
                Safety Awareness
              </span>

              <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[#38204F] sm:text-4xl lg:text-5xl">
                Small Steps Can Make
                <span className="text-[#8B5BAA]"> a Big Difference.</span>
              </h2>

              <p className="mb-9 max-w-lg text-base leading-8 text-gray-600">
                Staying informed and prepared can help you
                navigate everyday situations with greater
                confidence. Explore practical habits that
                support your personal safety.
              </p>

              <div className="space-y-6">
                {safetyTips.map((tip) => {
                  const Icon = tip.icon;

                  return (
                    <div
                      key={tip.title}
                      className="flex items-start gap-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#6E4A91] shadow-sm">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="mb-2 text-base font-bold text-[#38204F]">
                          {tip.title}
                        </h3>
                        <p className="text-sm leading-7 text-gray-600">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href="/safety-tips"
                className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#6E4A91] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#563775]"
              >
                Explore Safety Tips
                <ArrowRight size={18} />
              </a>
            </div>

            {/* IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-[30px] border-[8px] border-white bg-white shadow-xl shadow-purple-200/40">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=85"
                  alt="Woman representing confidence and personal safety"
                  loading="lazy"
                  className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[550px]"
                />
              </div>

              <div className="absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:-left-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2EAF8] text-[#6E4A91]">
                  <Lightbulb size={23} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#38204F]">
                    Knowledge Empowers
                  </p>
                  <p className="text-xs text-gray-500">
                    Learn. Prepare. Stay aware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="bg-white px-6 py-20 lg:px-12 lg:py-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#563775] px-7 py-16 text-center sm:px-12 lg:py-20">

            {/* Decorative Elements */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white">
                <ShieldCheck size={32} />
              </div>

              <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Your Safety Journey
                Starts Here.
              </h2>

              <p className="mx-auto mb-9 max-w-2xl text-base leading-8 text-purple-100">
                Take a positive step towards feeling more
                informed, prepared, and connected.
                Join SafeHer and access helpful safety
                resources in one simple platform.
              </p>

              <a
                href="/register"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#563775] transition hover:bg-[#F3EAF9]"
              >
                Create Your Free Account
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#281B38] px-6 pt-16 text-white lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 pb-14 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <a href="/" className="mb-6 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B5BAA]">
                <ShieldCheck size={24} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                SafeHer<span className="text-[#C8A3DB]">.</span>
              </span>
            </a>

            <p className="max-w-sm text-sm leading-8 text-gray-300">
              SafeHer is dedicated to promoting women's
              safety awareness through helpful information,
              practical guidance, and simple personal
              safety management tools.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300">
                <Heart size={18} />
              </span>
              <span className="text-sm text-gray-300">
                Empowering women through awareness.
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-6 text-base font-bold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4">
              <a href="/" className="text-sm text-gray-300 hover:text-white">
                Home
              </a>
              <a href="/about" className="text-sm text-gray-300 hover:text-white">
                About Us
              </a>
              <a href="/safety-tips" className="text-sm text-gray-300 hover:text-white">
                Safety Tips
              </a>
              <a href="/register" className="text-sm text-gray-300 hover:text-white">
                Get Started
              </a>
            </div>
          </div>

          {/* ACCOUNT LINKS */}
          <div>
            <h3 className="mb-6 text-base font-bold">
              Your Account
            </h3>

            <div className="flex flex-col gap-4">
              <a href="/login" className="text-sm text-gray-300 hover:text-white">
                Log In
              </a>
              <a href="/register" className="text-sm text-gray-300 hover:text-white">
                Create Account
              </a>
              <a href="/dashboard" className="text-sm text-gray-300 hover:text-white">
                Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center md:flex-row md:text-left">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SafeHer. All rights reserved.
          </p>

          <p className="text-sm text-gray-400">
            Made with care for women's safety and awareness.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
