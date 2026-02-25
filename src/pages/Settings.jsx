import React from "react";
import ThemeSettings from "../components/settings/ThemeSettings";
import ProfileInfo from "../components/settings/ProfileInfo";
import SettingsAbout from "../components/settings/SettingsAbout";

export default function Settings() {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 pt-10 pb-16">
<div
  className="
    w-full max-w-[1000px]
    rounded-3xl
    border-2 border-[var(--accent)]/20
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    shadow-sm dark:shadow-black/30
    px-6 sm:px-10 md:px-16
    py-10 md:py-14
    transition-colors duration-300
  "
>

        {/* Верхня секція */}
        <div className="
          flex flex-col lg:flex-row
          gap-10 lg:gap-16
          mb-14
        ">
          <ThemeSettings />
          <ProfileInfo />
        </div>

        {/* Нижня секція */}
        <SettingsAbout />

      </div>
    </div>
  );
}