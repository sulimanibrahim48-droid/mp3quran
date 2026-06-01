import { Home, Bookmark, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: "الرئيسية" },
    { to: "/favorites", icon: Bookmark, label: "المفضلة" },
    { to: "/settings", icon: User, label: "الإعدادات" },
  ];

  return (
    <>
      <footer className="pb-28 pt-8 bg-transparent">
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500 mb-4">
          <NavLink to="/settings" className="hover:text-gray-900 transition-colors">عن التطبيق</NavLink>
          <a
            href="https://www.youtube.com/channel/UCe9_SN79UetsCybvGKT5MnA"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            يوتيوب
          </a>
        </div>
        <p className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} مشغل القرآن الكريم. جميع الحقوق محفوظة
        </p>
      </footer>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-2 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  active ? "text-[hsl(var(--emerald))]" : "text-gray-400 hover:text-gray-600 mt-2"
                }`}
              >
                {active ? (
                  <div className="bg-emerald-50 px-4 py-1.5 rounded-2xl">
                    <Icon className="w-6 h-6" />
                  </div>
                ) : (
                  <Icon className="w-6 h-6" />
                )}
                <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Footer;
