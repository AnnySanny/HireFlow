import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const moodScore = {
  great: 5,
  excited: 5,
  good: 4,
  calm: 4,
  surprised: 4,
  bored: 3,
  sleepy: 3,
  anxious: 2,
  annoyed: 2,
  upset: 2,
  sad: 1,
  angry: 1,
};

export default function MoodInsights({ moods = [], period = "month" }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";

  const message = useMemo(() => {
    if (!moods.length) {
      return lang === "en"
        ? "Not enough data yet."
        : "Недостатньо даних для аналізу.";
    }

    const now = new Date();


    let startDate;
    let endDate;

    if (period === "week") {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;

      startDate = new Date(now);
      startDate.setDate(now.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    const filtered = moods
      .filter(m => m.createdAt && m.mood)
      .map(m => ({
        score: moodScore[m.mood] || 3,
        date: m.createdAt.toDate(),
      }))
      .filter(m => m.date >= startDate && m.date <= endDate);

    if (!filtered.length) {
      return lang === "en"
        ? "No records for this period yet."
        : "За цей період поки немає записів.";
    }

    

    const avg =
      filtered.reduce((a, b) => a + b.score, 0) /
      filtered.length;

    const positive = filtered.filter(m => m.score >= 4).length;
    const percent = Math.round((positive / filtered.length) * 100);

  

    const sorted = [...filtered].sort((a, b) => a.date - b.date);
    let streak = 0;

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].score >= 4) streak++;
      else break;
    }



    if (period === "week") {
      const byDay = {};

      sorted.forEach(m => {
        const day = m.date.toLocaleDateString(
          lang === "en" ? "en-US" : "uk-UA",
          { weekday: "long" }
        );

        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(m.score);
      });

      const averages = Object.keys(byDay).map(day => ({
        day,
        avg:
          byDay[day].reduce((a, b) => a + b, 0) /
          byDay[day].length,
      }));

      averages.sort((a, b) => b.avg - a.avg);

      const bestDay = averages[0]?.day;
      const worstDay = averages[averages.length - 1]?.day;

      if (avg >= 4.2) {
        return lang === "en"
          ? `This week is going very well. Your strongest day is ${bestDay}.`
          : `Цей тиждень проходить дуже добре. Найкращий день — ${bestDay}.`;
      }

      if (avg >= 3) {
        return lang === "en"
          ? `Your mood this week is mostly stable.`
          : `Ваш настрій цього тижня переважно стабільний.`;
      }

      return lang === "en"
        ? `You tend to feel lowest on ${worstDay}.`
        : `Найнижчий настрій цього тижня — ${worstDay}.`;
    }

    if (streak >= 4) {
      return lang === "en"
        ? `You have ${streak} positive days in a row this month.`
        : `У вас ${streak} позитивних днів поспіль цього місяця.`;
    }

    if (percent >= 70) {
      return lang === "en"
        ? "More than 70% of this month's moods are positive."
        : "Понад 70% записів цього місяця — позитивні.";
    }

    if (avg >= 4) {
      return lang === "en"
        ? "This month looks emotionally strong."
        : "Цей місяць емоційно дуже позитивний.";
    }

    if (avg >= 3) {
      return lang === "en"
        ? "Your emotional state this month is generally balanced."
        : "Ваш емоційний стан цього місяця загалом збалансований.";
    }

    return lang === "en"
      ? "There are recurring low-mood patterns this month."
      : "Помітні повторювані періоди зниженого настрою цього місяця.";

  }, [moods, period, lang]);

  return (
   <div
  className="
    w-full max-w-[900px]
    rounded-[40px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-10 py-10 mb-14
    text-center
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>

      <h2 className="text-[24px] mb-6">
        {lang === "en"
          ? "Your mood insights"
          : "Аналітика настрою"}
      </h2>

      <p className="opacity-90">{message}</p>

    </div>
  );
}