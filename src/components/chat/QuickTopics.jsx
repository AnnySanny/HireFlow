import React from "react";
import { useTranslation } from "react-i18next";

export default function QuickTopics({ onSelect }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";

  const hoverClass = `
    relative inline-block
    transition-all duration-300
    text-gray-900 dark:text-gray-100
    hover:text-accent

    after:absolute after:left-0 after:-bottom-0.5
    after:h-[1px] after:w-0
    after:bg-accent
    after:transition-all after:duration-300
    hover:after:w-full

    cursor-pointer
  `;

  const topics = [
    { en: "Tell me about my mood patterns", ua: "Розкажи про мої патерни настрою" },
    { en: "I need some motivation", ua: "Мені потрібна мотивація" },
    { en: "I'm feeling stressed today", ua: "Сьогодні я відчуваю стрес" },
    { en: "How can I cope with anxiety?", ua: "Як впоратися з тривожністю?" },
    { en: "Why do I feel emotionally drained?", ua: "Чому я почуваюся емоційно виснаженим?" },
    { en: "Help me calm down right now", ua: "Допоможи мені заспокоїтися зараз" },
    { en: "How can I improve my sleep?", ua: "Як покращити мій сон?" },
    { en: "I feel unproductive lately", ua: "Останнім часом я почуваюся непродуктивним" },
    { en: "Give me a short breathing exercise", ua: "Дай мені коротку дихальну вправу" },
    { en: "How do I handle overthinking?", ua: "Як впоратися з надмірними думками?" },
  ];

  return (
<div
  className="
    w-full lg:w-[380px]
    rounded-[35px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-6 sm:px-8 py-10
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
      <h3 className="text-[20px] mb-8 font-semibold tracking-wide">
        {lang === "en" ? "Quick topics" : "Швидкі теми"}
      </h3>

      <div className="flex flex-col gap-4 text-[15px] font-serif opacity-90">
        {topics.map((topic, i) => (
          <span
            key={i}
            onClick={() => onSelect(lang === "en" ? topic.en : topic.ua)}
            className={hoverClass}
          >
            {lang === "en" ? topic.en : topic.ua}
          </span>
        ))}
      </div>
    </div>
  );
}