import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  MessageCircle,
  Settings,
} from "lucide-react";

export default function Header() {
  const { i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();
  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
  };
  const handleLogout = async () => {
    await signOut(auth);
    setMobileOpen(false);
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    let greeting;

    if (hour < 12) {
      greeting = lang === "en" ? "Good morning" : "Доброго ранку";
    } else if (hour < 18) {
      greeting = lang === "en" ? "Good afternoon" : "Доброго дня";
    } else {
      greeting = lang === "en" ? "Good evening" : "Доброго вечора";
    }

    const name = user?.name || user?.email?.split("@")[0] || "";

    return user ? `${greeting}, ${name}!` : greeting + "!";
  };
  const menu = [
    {
      path: "/dashboard",
      label: lang === "en" ? "Dashboard" : "Головна",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: "/journal",
      label: lang === "en" ? "Journal" : "Щоденник",
      icon: <BookOpen size={18} />,
    },
    {
      path: "/statistics",
      label: lang === "en" ? "Statistics" : "Статистика",
      icon: <BarChart3 size={18} />,
    },
    {
      path: "/support",
      label: lang === "en" ? "Support" : "Підтримка",
      icon: <MessageCircle size={18} />,
    },
    {
      path: "/settings",
      label: lang === "en" ? "Settings" : "Налаштування",
      icon: <Settings size={18} />,
    },
  ];

  return (
    <>
   
    <header
  className="
    w-full flex items-center justify-between
    px-5 sm:px-8 py-4
    border-b-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
     
        <div className="flex items-center gap-3 lg:hidden">
          <img
            src="/img/logo.png"
            alt="MoodBloom"
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-lg">MoodBloom</span>
        </div>

   
        <div className="hidden lg:block">
          <h1
            className="text-[26px]"
          >
            {getGreeting()}
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div
            className="
            flex items-center gap-2
            border border-accent
            rounded-full px-3 py-1
          "
          >
            <button
              onClick={() => changeLang("ua")}
              className={`text-sm ${
                lang === "ua"
                  ? "text-accent font-semibold"
                  : "opacity-60 hover:text-accent"
              }`}
            >
              UA
            </button>

            <span className="opacity-40">|</span>

            <button
              onClick={() => changeLang("en")}
              className={`text-sm ${
                lang === "en"
                  ? "text-accent font-semibold"
                  : "opacity-60 hover:text-accent"
              }`}
            >
              EN
            </button>
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="
      px-5 py-2 rounded-lg
      border border-red-500
      text-red-500
      hover:bg-red-500 hover:text-white
      transition
    "
            >
              {lang === "en" ? "Logout" : "Вийти"}
            </button>
          ) : (
            <Link
              to="/auth"
              className="
      px-5 py-2 rounded-lg
      border border-accent
      text-accent
      hover:bg-accent hover:text-white
      transition
    "
            >
              {lang === "en" ? "Login" : "Увійти"}
            </Link>
          )}
        </div>

    
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-accent"
        >
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
            bg-white dark:bg-gray-950
            p-6
            shadow-xl
            flex flex-col
            transition-theme
          "
          >
          
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img src="/img/logo.png" alt="MoodBloom" className="w-7 h-7" />
                <span className="font-semibold text-accent">MoodBloom</span>
              </div>

              <button onClick={() => setMobileOpen(false)}>
                <X size={22} className="text-accent" />
              </button>
            </div>

          
            <nav className="flex flex-col gap-4">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center justify-between
                    px-4 py-3 rounded-xl
                    border transition
                    ${
                      isActive
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-transparent hover:border-accent hover:text-accent"
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

            <div className="my-6 border-t opacity-20" />

            <div className="w-full mb-4">
              <div className="relative flex bg-gray-200 dark:bg-gray-800 rounded-full p-1">
                <div
                  className={`
        absolute top-1 bottom-1 w-1/2 rounded-full bg-accent transition-all duration-300
        ${lang === "en" ? "left-1/2" : "left-0"}
      `}
                />

                <button
                  onClick={() => changeLang("ua")}
                  className={`
        relative z-10 flex-1 py-2 text-sm font-medium transition
        ${lang === "ua" ? "text-white" : "text-gray-600 dark:text-gray-300"}
      `}
                >
                  UA
                </button>

                <button
                  onClick={() => changeLang("en")}
                  className={`
        relative z-10 flex-1 py-2 text-sm font-medium transition
        ${lang === "en" ? "text-white" : "text-gray-600 dark:text-gray-300"}
      `}
                >
                  EN
                </button>
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="
      text-center
      px-4 py-2 rounded-lg
      border border-red-500
      text-red-500
      hover:bg-red-500 hover:text-white
      transition
    "
              >
                {lang === "en" ? "Logout" : "Вийти"}
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="
      text-center
      px-4 py-2 rounded-lg
      border border-accent
      text-accent
      hover:bg-accent hover:text-white
      transition
    "
              >
                {lang === "en" ? "Login" : "Увійти"}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
