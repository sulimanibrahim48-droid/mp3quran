import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import makkahBg from "@/assets/makkah-bg.jpg";

const HeroBanner = () => {
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="relative w-full bg-[hsl(var(--emerald))] text-white rounded-b-[40px] overflow-hidden pb-12">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-black/20 z-0" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 mix-blend-overlay"
        style={{ backgroundImage: `url(${makkahBg})` }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-transparent to-transparent z-0" />

      {/* Top Navigation */}
      <div className="relative z-20 flex items-center justify-between px-6 py-6 border-b border-white/10">
        <button className="text-white/90 hover:text-white transition-colors" onClick={toggle} aria-label="Theme Toggle">
          {isDark ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <h1 className="text-xl font-bold tracking-wide">مشغل القرآن الكريم</h1>
        <button className="text-white/90 hover:text-white transition-colors" aria-label="الإعدادات" onClick={() => navigate("/settings")}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 pt-12 pb-8 text-center flex flex-col items-center justify-center gap-5">
        <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto font-medium leading-relaxed drop-shadow-md">
          استمتع بتجربة إيمانية فريدة مع أفضل القراء في العالم الإسلامي
        </p>

        {/* YouTube Channel Link */}
        <a
          href="https://www.youtube.com/channel/UCe9_SN79UetsCybvGKT5MnA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/20 rounded-2xl px-5 py-3 transition-all duration-200"
        >
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <div className="text-right">
            <span className="block text-sm font-semibold">قناة تلاوة القرآن الكريم</span>
            <span className="block text-[11px] text-white/70">تابعنا على يوتيوب</span>
          </div>
          <svg className="w-4 h-4 text-white/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9" />
          </svg>
        </a>
      </div>
    </header>
  );
};

export default HeroBanner;
