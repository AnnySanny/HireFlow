import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeSettings() {
  const { i18n } = useTranslation();
  const { theme, setTheme, mode, setMode } = useTheme();
  const lang = i18n.language === "en" ? "en" : "ua";

  const colors = [
    { id: "pink", nameEn: "Soft pink", nameUa: "Ніжно-рожевий" },
    { id: "green", nameEn: "Muted green", nameUa: "Спокійний зелений" },
    { id: "blue", nameEn: "Calm blue", nameUa: "Спокійний синій" },
    { id: "orange", nameEn: "Warm orange", nameUa: "Теплий помаранчевий" },
    { id: "classic", nameEn: "Classic mode", nameUa: "Класичний режим" },
  ];

  return (
  <div className="
  w-full lg:w-[420px]
  bg-slate-50 dark:bg-slate-900
  text-slate-800 dark:text-slate-100
  p-6 rounded-2xl
  transition-colors duration-300
">

      <h3 className="text-[20px] mb-8 font-semibold">
        {lang === "en" ? "Accent color" : "Акцентний колір"}
      </h3>

      <div className="flex flex-col gap-4">
        {colors.map((c) => (
          <div
            key={c.id}
            onClick={() => setTheme(c.id)}
            className={`
              h-[50px] rounded-full border
              px-6 flex items-center justify-between
              cursor-pointer transition-all duration-200
              hover:border-accent
              ${theme === c.id ? "border-accent bg-accent/10" : ""}
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-5 h-5 rounded-full border"
                style={{
                  backgroundColor:
                    theme === c.id ? "var(--accent)" : "transparent",
                }}
              />
              <span className="text-[15px]">
                {lang === "en" ? c.nameEn : c.nameUa}
              </span>
            </div>

            {theme === c.id && (
              <span className="text-accent font-semibold">✓</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10">
        <h4 className="text-[16px] mb-4 font-medium">
          {lang === "en" ? "Theme" : "Тема"}
        </h4>

        <div className="flex gap-4">
          <button
            onClick={() => setMode("light")}
            className={`
              px-6 py-2 rounded-full border transition-all
              ${mode === "light"
                ? "bg-accent text-white border-accent"
                : "hover:border-accent"}
            `}
          >
            {lang === "en" ? "Light" : "Світла"}
          </button>

          <button
            onClick={() => setMode("dark")}
            className={`
              px-6 py-2 rounded-full border transition-all
              ${mode === "dark"
                ? "bg-accent text-white border-accent"
                : "hover:border-accent"}
            `}
          >
            {lang === "en" ? "Dark" : "Темна"}
          </button>
        </div>
      </div>

    </div>
  );
}