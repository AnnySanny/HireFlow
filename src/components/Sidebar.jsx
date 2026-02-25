import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const lang = i18n.language === "en" ? "en" : "ua";

  const menu = [
    {
      path: "/dashboard",
      label: lang === "en" ? "Dashboard" : "Головна",
      icon: <LayoutDashboard size={18} />,
      public: true,
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
      label: lang === "en" ? "Support Chat" : "Підтримка",
      icon: <MessageCircle size={18} />,
    },
    {
      path: "/settings",
      label: lang === "en" ? "Settings" : "Налаштування",
      icon: <Settings size={18} />,
    },
  ];

  return (
<aside
  className="
    w-[300px] min-h-screen flex flex-col
    pt-10 px-8
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    border-r-2 border-[var(--accent)]/15
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>

      <div className="flex items-center gap-4 mb-14">
        <img
          src="/img/logo.png"
          alt="MoodBloom logo"
          className="w-13 h-13 object-contain"
        />

        <div>
          <h2
            className="text-[28px] leading-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            MoodBloom
          </h2>

          <p
            className="text-[14px] italic opacity-70"
            style={{ fontFamily: "Dancing Script, cursive" }}
          >
            {lang === "en" ? "Mental Health Tracker" : "Трекер настрою"}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-6">
        {menu.map((item) => {
          const isAllowed = user || item.public;

          return (
            <NavLink
              key={item.path}
              to={isAllowed ? item.path : "#"}
              onClick={(e) => {
                if (!isAllowed) e.preventDefault();
              }}
              className={({ isActive }) =>
                `
                h-[52px]
                flex items-center justify-between
                px-6
                rounded-[18px]
                transition-all duration-200
                border
                ${
                  !isAllowed
                    ? "opacity-40 cursor-not-allowed border-transparent"
                    : isActive
                    ? "border-accent text-accent bg-accent/10 font-semibold"
                    : "border-transparent hover:border-accent hover:text-accent"
                }
                `
              }
            >
              <span
                className="text-[16px]"
                style={{
                  fontFamily: "Goldman, sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {item.label}
              </span>

              <span className="opacity-80">
                {item.icon}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}