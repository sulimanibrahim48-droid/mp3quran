import { BookOpen } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import makkahBg from "@/assets/makkah-bg.jpg";

const HeroBanner = () => {
  const { isDark, toggle } = useTheme();

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
        <button className="text-white/90 hover:text-white transition-colors" aria-label="Menu" onClick={() => import("sonner").then(({ toast }) => toast.info("القائمة الجانبية قيد التطوير"))}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 pt-12 pb-8 text-center flex flex-col items-center justify-center">
        <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto font-medium leading-relaxed drop-shadow-md">
          استمتع بتجربة إيمانية فريدة مع أفضل القراء في العالم الإسلامي
        </p>
      </div>
    </header>
  );
};

export default HeroBanner;
