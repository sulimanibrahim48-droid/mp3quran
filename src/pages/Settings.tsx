import { useNavigate } from "react-router-dom";
import { ArrowRight, Moon, Sun, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { clearFavorites } from "@/lib/favorites";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  const handleClear = () => {
    clearFavorites();
    toast.success("تم مسح المفضلة");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-[hsl(var(--emerald))] text-white px-6 py-6 rounded-b-[40px] flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-white hover:bg-white/10 rounded-full" aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">الإعدادات</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl w-full mx-auto space-y-3">
        <div className="bg-card rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <div className="text-right">
              <p className="font-bold text-foreground">الوضع الداكن</p>
              <p className="text-xs text-muted-foreground">تبديل المظهر بين الفاتح والداكن</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={toggle} />
        </div>

        <button
          onClick={handleClear}
          className="w-full bg-card rounded-2xl p-4 flex items-center justify-between shadow-sm hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-destructive" />
            <div className="text-right">
              <p className="font-bold text-foreground">مسح المفضلة</p>
              <p className="text-xs text-muted-foreground">حذف جميع السور المحفوظة</p>
            </div>
          </div>
        </button>

        <div className="bg-card rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 mt-0.5 text-muted-foreground" />
          <div className="text-right">
            <p className="font-bold text-foreground">عن التطبيق</p>
            <p className="text-xs text-muted-foreground mt-1">
              مشغل القرآن الكريم - استمع لتلاوات أشهر القراء من جميع أنحاء العالم الإسلامي.
            </p>
            <p className="text-xs text-muted-foreground mt-2">الإصدار 1.0.0</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
