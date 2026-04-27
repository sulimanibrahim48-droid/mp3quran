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
        <button className="text-white/90 hover:text-white transition-colors" onClick={toggle} aria-label="Settings/Theme Toggle">
          {/* Using gear instead of sun/moon, but linking dark mode for now */}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <h1 className="text-xl font-bold tracking-wide">مشغل القرآن الكريم</h1>
        <button className="text-white/90 hover:text-white transition-colors" aria-label="Menu">
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
