import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  KanbanSquare,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menu = [
    {
      path: "/dashboard",
      label: "Дашборд",
      icon: LayoutDashboard,
      public: true,
    },
    {
      path: "/vacancies",
      label: "Вакансії",
      icon: Briefcase,
    },
    {
      path: "/candidates",
      label: "Кандидати",
      icon: Users,
    },
    {
      path: "/kanban",
      label: "Kanban",
      icon: KanbanSquare,
    },
    {
      path: "/analytics",
      label: "Аналітика",
      icon: BarChart3,
    },
    {
      path: "/settings",
      label: "Налаштування",
      icon: Settings,
    },
  ];

  return (
    <aside
      className="
        hidden lg:flex
        w-[280px] min-h-screen flex-col
        pt-10 px-8
        bg-white dark:bg-slate-900
        text-slate-800 dark:text-slate-100
        border-r border-slate-200 dark:border-slate-800
      "
    >
      <div className="flex items-center gap-3 mb-14">
        <img
          src="/img/logo.png"
          alt="HireFlow logo"
          className="w-11 h-11 object-contain"
        />

        <h2
          className="text-[26px] font-semibold tracking-wide"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Hire<span className="text-blue-500">Flow</span>
        </h2>
      </div>
      <nav className="flex flex-col gap-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const isAllowed = user || item.public;

          return (
            <NavLink
              key={item.path}
              to={
                item.path === "/dashboard"
                  ? user
                    ? "/dashboard"
                    : "/dashboard-guest"
                  : isAllowed
                    ? item.path
                    : "#"
              }
              onClick={(e) => {
                if (!isAllowed) e.preventDefault();
              }}
              className={({ isActive }) =>
                `
                flex items-center justify-between
                h-[48px]
                px-5
                rounded-xl
                transition-all duration-200
                border
                ${
                  !isAllowed
                    ? "opacity-40 cursor-not-allowed border-transparent"
                    : isActive
                      ? "border-blue-500 bg-blue-50 dark:bg-slate-800"
                      : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-[15px] ${
                      isActive ? "text-blue-500 font-medium" : ""
                    }`}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {item.label}
                  </span>

                  <Icon
                    size={isActive ? 22 : 18}
                    className={`${isActive ? "text-blue-500" : "opacity-80"}`}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
