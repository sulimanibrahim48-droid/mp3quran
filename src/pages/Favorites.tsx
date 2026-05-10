import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Trash2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { getFavorites, removeFavorite, type FavoriteItem } from "@/lib/favorites";

const Favorites = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setItems(getFavorites());
  }, []);

  const playItem = (item: FavoriteItem) => {
    navigate("/player", {
      state: {
        surahs: [item.surah],
        index: 0,
        reciterName: item.reciterName,
      },
    });
  };

  const handleRemove = (item: FavoriteItem) => {
    setItems(removeFavorite(item.surah.id, item.surah.url));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-[hsl(var(--emerald))] text-white px-6 py-6 rounded-b-[40px] flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-white hover:bg-white/10 rounded-full" aria-label="رجوع">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">المفضلة</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl w-full mx-auto">
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">لا توجد سور في المفضلة</p>
            <p className="text-sm mt-2">أضف سورًا من شاشة الاستماع</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={`${item.surah.id}-${item.surah.url}`} className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
                <button onClick={() => playItem(item)} className="flex-1 text-right">
                  <p className="font-bold text-gray-900">{item.surah.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.reciterName}</p>
                </button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => playItem(item)} aria-label="تشغيل">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(item)} aria-label="حذف">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
