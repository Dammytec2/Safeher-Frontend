
import { ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#FCF9FF] to-[#F3EAF9]">

      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-12 lg:py-24">

        {/* LEFT SIDE */}
        <div className="max-w-xl">

          {/* Small Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-medium text-[#6E4A91] shadow-sm">
            <ShieldCheck size={17} />
            Your Safety, Our Priority
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-[#38204F] sm:text-5xl lg:text-[60px]">
            Feel Safer.
            <br />
            Stay Confident.
            <br />
            <span className="text-[#8B5BAA]">
              Live Fearlessly.
            </span>
          </h1>

          {/* Description */}
          <p className="mb-9 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
            Every woman deserves to feel safe and empowered.
            SafeHer provides helpful safety resources,
            practical tips, and a simple way to manage
            the people you trust.
          </p>

          {/* Buttons */}
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

          {/* Small Supporting Text */}
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

          {/* Background Decoration */}
          <div className="absolute -right-5 -top-5 h-44 w-44 rounded-full bg-[#E8D6F3] blur-3xl" />

          <div className="absolute -bottom-6 -left-5 h-48 w-48 rounded-full bg-[#DCC7EC] blur-3xl" />

          {/* Image Container */}
          <div className="relative overflow-hidden rounded-[32px] border-[8px] border-white bg-[#EEE3F6] shadow-2xl shadow-purple-200/50">

          

<img
  src="/hero-woman.jpg"
  alt="Confident woman representing SafeHer"
  className="h-[350px] w-full object-cover object-center sm:h-[470px] lg:h-[520px]"
/>



          </div>

          {/* Floating Safety Card */}
          <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-5 py-4 shadow-xl sm:-left-6">

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
  );
};

export default Hero;
