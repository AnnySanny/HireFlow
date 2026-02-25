import React from "react";
import { useTranslation } from "react-i18next";
import { Lock, TrendingUp, Heart } from "lucide-react";

export default function SettingsAbout() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";

  return (
    <>
     
      <div className="mb-12">

        <h4 className="text-[16px] mb-4 font-medium">
          {lang === "en" ? "About MoodBloom" : "Про MoodBloom"}
        </h4>

        <p className="text-[14px] leading-relaxed opacity-80 mb-4">
          {lang === "en"
            ? "MoodBloom is a personal emotional tracking system designed to help you understand your mood patterns, build self-awareness, and improve your overall wellbeing."
            : "MoodBloom — це персональна система відстеження емоційного стану, яка допомагає зрозуміти власні патерни настрою, розвинути усвідомленість та покращити загальне самопочуття."}
        </p>

        <p className="text-[14px] leading-relaxed opacity-80">
          {lang === "en"
            ? "The application allows you to record daily check-ins, monitor long-term trends, and reflect on emotional changes over time in a safe and private environment."
            : "Застосунок дозволяє фіксувати щоденні перевірки настрою, відстежувати довгострокові тенденції та аналізувати зміни емоцій у безпечному й приватному середовищі."}
        </p>

      </div>

   
      <div className="
        flex flex-col sm:flex-row
        justify-between items-start
        gap-8 sm:gap-6
        mb-10
      ">

        <div className="flex flex-col items-center gap-3 text-accent text-center max-w-[200px]">
          <Lock size={30} />
          <span className="text-[14px] font-medium">
            {lang === "en" ? "Privacy First" : "Приватність понад усе"}
          </span>
          <p className="text-[13px] opacity-70 text-gray-600 dark:text-gray-300">
            {lang === "en"
              ? "Your personal data is securely stored and accessible only to you."
              : "Ваші персональні дані зберігаються безпечно та доступні лише вам."}
          </p>
        </div>

   
        <div className="flex flex-col items-center gap-3 text-accent text-center max-w-[200px]">
          <TrendingUp size={30} />
          <span className="text-[14px] font-medium">
            {lang === "en" ? "Track Progress" : "Відстежуйте прогрес"}
          </span>
          <p className="text-[13px] opacity-70 text-gray-600 dark:text-gray-300">
            {lang === "en"
              ? "Visual insights help you see how your mood evolves over time."
              : "Візуальна аналітика допомагає побачити, як змінюється ваш настрій з часом."}
          </p>
        </div>

       
        <div className="flex flex-col items-center gap-3 text-accent text-center max-w-[200px]">
          <Heart size={30} />
          <span className="text-[14px] font-medium">
            {lang === "en" ? "Self-Care" : "Самодогляд"}
          </span>
          <p className="text-[13px] opacity-70 text-gray-600 dark:text-gray-300">
            {lang === "en"
              ? "Encourages healthy habits and emotional awareness every day."
              : "Сприяє формуванню здорових звичок та щоденної емоційної усвідомленості."}
          </p>
        </div>

      </div>

      <div className="text-center text-[13px] opacity-70">
        {lang === "en"
          ? "Version 1.0.0 · Made with care"
          : "Версія 1.0.0 · Створено з турботою"}
      </div>
    </>
  );
}