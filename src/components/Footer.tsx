import { Home, Bookmark, User } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="pb-28 pt-8 bg-transparent">
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500 mb-4">
          <a href="#" className="hover:text-gray-900 transition-colors">عن التطبيق</a>
          <a href="#" className="hover:text-gray-900 transition-colors">سياسة الخصوصية</a>
        </div>
        <p className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} مشغل القرآن الكريم. جميع الحقوق محفوظة
        </p>
      </footer>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-2 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-[hsl(var(--emerald))] transition-colors">
            <div className="bg-emerald-50 px-4 py-1.5 rounded-2xl">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors mt-2">
            <Bookmark className="w-6 h-6" />
            <span className="text-[10px] font-medium">المفضلة</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors mt-2">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">الإعدادات</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Footer;
