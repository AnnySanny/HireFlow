import React from "react";
import { useTranslation } from "react-i18next";

export default function AboutChat() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";

  const hoverClass = `
    relative inline-block
    after:absolute after:left-0 after:-bottom-0.5
    after:h-[1px] after:w-0
    after:bg-accent
    after:transition-all after:duration-300
    hover:after:w-full
    cursor-default
  `;

  return (
<div
  className="
    w-full lg:w-[520px]
    rounded-[35px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-6 sm:px-10 py-10
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
      <h3 className="text-[20px] mb-8 font-semibold tracking-wide">
        {lang === "en" ? "About This Chat" : "Про цей чат"}
      </h3>

      <div className="text-[15px] leading-relaxed space-y-4 font-serif opacity-90">
        <p>
          <span className={hoverClass}>
            {lang === "en" ? "Supportive Companion" : "Підтримуючий помічник"}
          </span>
        </p>

        <p>
          {lang === "en" ? "Get " : "Отримуйте "}
          <span className={hoverClass}>
            {lang === "en" ? "encouragement" : "підтримку"}
          </span>
          {lang === "en" ? " and general " : " та загальні "}
          <span className={hoverClass}>
            {lang === "en"
              ? "mental health tips"
              : "поради для ментального здоровʼя"}
          </span>
        </p>

        <p>
          {lang === "en"
            ? "Responses are based on your "
            : "Відповіді формуються на основі ваших "}
          <span className={hoverClass}>
            {lang === "en" ? "mood tracking patterns" : "патернів настрою"}
          </span>
        </p>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-block mb-3">
            <span
              className="
        px-4 py-1.5
        rounded-full
        text-[13px] font-semibold tracking-wide
        bg-gray-900 text-white
        dark:bg-white dark:text-gray-900
        shadow-md
        transition
      "
            >
              {lang === "en" ? "Not a Replacement" : "Не є заміною терапії"}
            </span>
          </div>

          <p className="text-[14px] opacity-80 leading-relaxed">
            {lang === "en"
              ? "This chat provides supportive guidance but does not replace professional psychological care."
              : "Цей чат надає підтримуючі поради, але не замінює професійну психологічну допомогу."}
          </p>
        </div>
      </div>
    </div>
  );
}
