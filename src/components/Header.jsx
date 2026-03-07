import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  Users,
  KanbanSquare,
  BarChart3,
  Sun,
  Moon,
  LogOut,
  User,
   Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    await signOut(auth);
    setMobileOpen(false);
     navigate("/");
  };

  const menu = [
    {
      path: "/",
      label: "Дашборд",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/vacancies", label: "Вакансії", icon: <Briefcase size={18} /> },
    { path: "/candidates", label: "Кандидати", icon: <Users size={18} /> },
    { path: "/kanban", label: "Kanban", icon: <KanbanSquare size={18} /> },
    { path: "/analytics", label: "Аналітика", icon: <BarChart3 size={18} /> },
    { path: "/settings", label: "Налаштування", icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const days = [
        "Неділя",
        "Понеділок",
        "Вівторок",
        "Середа",
        "Четвер",
        "Пʼятниця",
        "Субота",
      ];

      const day = days[now.getDay()];
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      setTime(`${day}, ${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const username = user?.name || user?.email?.split("@")[0] || "";

  return (
    <>
      <header
        className="
w-full flex items-center justify-between
px-6 py-4
border-b border-slate-200 dark:border-slate-800
bg-white dark:bg-slate-900
text-slate-800 dark:text-slate-100
"
      >
        <div className="flex items-center gap-3 lg:hidden">
          <img src="/img/logo.png" alt="HireFlow" className="w-10 h-10" />

          <span className="font-semibold">
            Hire<span className="text-blue-500">Flow</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 min-w-[140px]">
          {user && (
            <>
              <User size={24} className="text-blue-500" />
              <span className="text-lg font-semibold">{username}</span>
            </>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="text-lg font-medium text-blue-500">{time}</div>

          <button
            onClick={toggleTheme}
            className="
p-2 rounded-lg
hover:bg-slate-100
dark:hover:bg-slate-800
transition
"
          >
            <Sun className="dark:hidden" size={22} />
            <Moon className="hidden dark:block" size={22} />
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="
flex items-center gap-2
px-5 py-2 rounded-lg
border border-blue-500
text-blue-500
hover:bg-blue-500 hover:text-white
transition
"
            >
              <LogOut size={16} />
              Вийти
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="
px-5 py-2 rounded-lg
border border-blue-500
text-blue-500
hover:bg-blue-500 hover:text-white
transition
"
              >
                Вхід
              </Link>

              <Link
                to="/register"
                className="
px-5 py-2 rounded-lg
border border-blue-500
text-blue-500
hover:bg-blue-500 hover:text-white
transition
"
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setMobileOpen(true)} className="lg:hidden">
          <Menu size={26} />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="
w-[280px]
bg-white dark:bg-slate-900
p-6
flex flex-col
shadow-xl
"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/img/logo.png" className="w-7 h-7" />

                <span className="font-semibold">
                  Hire<span className="text-blue-500">Flow</span>
                </span>
              </div>

              <button onClick={() => setMobileOpen(false)}>
                <X size={22} />
              </button>
            </div>

<div className="flex items-center justify-between mb-6 min-h-[32px]">

  <div className="flex items-center gap-3">
    {user && (
      <>
        <User size={20} className="text-blue-500" />
        <span className="font-medium">{username}</span>
      </>
    )}
  </div>

  <button
    onClick={toggleTheme}
    className="
p-2 rounded-lg
hover:bg-slate-100
dark:hover:bg-slate-800
"
  >
    <Sun className="dark:hidden" size={22} />
    <Moon className="hidden dark:block" size={22} />
  </button>

</div>

            <nav className="flex flex-col gap-3">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
flex items-center justify-between
px-4 py-3 rounded-xl
transition
${
  isActive
    ? "bg-slate-100 dark:bg-slate-800"
    : "hover:bg-slate-100 dark:hover:bg-slate-800"
}
`
                  }
                >
                  <span className="flex items-center gap-3">
                    {item.icon}

                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="my-6 border-t border-slate-200 dark:border-slate-800" />



            {user ? (
              <button
                onClick={handleLogout}
                className="
w-full
flex items-center justify-center gap-2
px-4 py-2
rounded-lg
border border-blue-500
text-blue-500
hover:bg-blue-500 hover:text-white
transition
"
              >
                <LogOut size={16} />
                Вийти
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
w-full text-center
px-4 py-2
rounded-lg
border border-blue-500
text-blue-500
hover:bg-blue-500 hover:text-white
transition
"
                >
                  Вхід
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="
w-full text-center
px-4 py-2
rounded-lg
border border-blue-500
text-blue-500
hover:bg-blue-500 hover:text-white
transition
"
                >
                  Реєстрація
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
