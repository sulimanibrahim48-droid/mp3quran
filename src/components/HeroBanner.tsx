import { BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import makkahBg from "@/assets/makkah-bg.jpg";

const HeroBanner = () => {
  const { isDark, toggle } = useTheme();

  return (
    <header className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${makkahBg})` }}
      />
      {/* Dark overlay to hide any text in image and ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.85)] via-[hsl(var(--primary)/0.7)] to-[hsl(var(--primary)/0.9)]" />
      <div className="absolute inset-0 islamic-pattern opacity-40" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[hsl(var(--gold)/0.08)] blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[hsl(var(--gold)/0.06)] blur-3xl" />

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-xl bg-[hsl(var(--gold)/0.15)] backdrop-blur-sm border border-[hsl(var(--gold)/0.2)] flex items-center justify-center hover:bg-[hsl(var(--gold)/0.25)] transition-colors"
        aria-label="تبديل الوضع"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-[hsl(var(--gold))]" />
        ) : (
          <Moon className="w-5 h-5 text-[hsl(var(--gold))]" />
        )}
      </button>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[hsl(var(--gold)/0.15)] backdrop-blur-sm border border-[hsl(var(--gold)/0.2)] mb-6">
          <BookOpen className="w-10 h-10 text-[hsl(var(--gold))]" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-4 leading-tight">
          القرآن الكريم
        </h1>
        <p className="text-lg md:text-xl text-[hsl(var(--gold-light))] max-w-xl mx-auto font-light">
          رحلة طيبة في رحاب القرآن الكريم
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="block w-12 h-px bg-[hsl(var(--gold)/0.4)]" />
          <span className="block w-2 h-2 rounded-full bg-[hsl(var(--gold)/0.6)]" />
          <span className="block w-12 h-px bg-[hsl(var(--gold)/0.4)]" />
        </div>
      </div>
    </header>
  );
};

export default HeroBanner;
