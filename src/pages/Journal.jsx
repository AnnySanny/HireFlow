import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Journal() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();

  const [moods, setMoods] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const moodColors = {
    great: "bg-lime-500",
    good: "bg-green-500",
    excited: "bg-amber-400",
    calm: "bg-cyan-500",
    surprised: "bg-violet-500",
    sad: "bg-blue-600",
    anxious: "bg-rose-500",
    upset: "bg-indigo-600",
    angry: "bg-red-600",
    annoyed: "bg-orange-500",
    bored: "bg-zinc-500",
    sleepy: "bg-slate-500",
  };

  const moodTranslations = {
    great: { en: "Great", ua: "Чудово" },
    good: { en: "Good", ua: "Добре" },
    excited: { en: "Excited", ua: "Схвильований" },
    calm: { en: "Calm", ua: "Спокійний" },
    surprised: { en: "Surprised", ua: "Здивований" },
    sad: { en: "Sad", ua: "Сумно" },
    anxious: { en: "Anxious", ua: "Тривожний" },
    upset: { en: "Upset", ua: "Засмучений" },
    angry: { en: "Angry", ua: "Злий" },
    annoyed: { en: "Annoyed", ua: "Роздратований" },
    bored: { en: "Bored", ua: "Нудно" },
    sleepy: { en: "Sleepy", ua: "Сонний" },
  };

  const days =
    lang === "en"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  useEffect(() => {
    if (!user) return;

    const fetchMoods = async () => {
      const q = query(
        collection(db, "moods"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setMoods(data);
    };

    fetchMoods();
  }, [user]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let firstDayOfWeek = new Date(year, month, 1).getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const formattedDateKey = (day) => {
    const d = String(day).padStart(2, "0");
    const m = String(month + 1).padStart(2, "0");
    return `${d}.${m}`;
  };

  const selectedMood = moods.find((m) =>
    m.formattedDate?.startsWith(
      selectedDay ? formattedDateKey(selectedDay) : ""
    )
  );

  const activeDate = selectedDay
    ? new Date(year, month, selectedDay)
    : currentDate;

  const goPrev = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const goNext = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4">
      <div className="w-full max-w-[900px] flex items-center justify-between mb-8">
        <h2 className="text-[20px] sm:text-[22px] tracking-wide">
          {activeDate.toLocaleDateString(
            lang === "en" ? "en-US" : "uk-UA",
            { weekday: "long", year: "numeric", month: "long", day: "numeric" }
          )}
        </h2>

        <div className="flex gap-6 text-accent">
          <ChevronLeft
            size={22}
            onClick={goPrev}
            className="cursor-pointer hover:scale-110 transition"
          />
          <ChevronRight
            size={22}
            onClick={goNext}
            className="cursor-pointer hover:scale-110 transition"
          />
        </div>
      </div>

      <div className="w-full max-w-[900px] flex flex-col lg:flex-row gap-10 lg:gap-14">
        <div
  className="
    w-full lg:w-[520px]
    rounded-[35px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-6 sm:px-8 py-8
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
          <div className="grid grid-cols-7 text-center text-[14px] mb-6 text-accent font-medium">
            {days.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 sm:gap-4">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-[44px] sm:w-[56px] h-[44px] sm:h-[56px]"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const key = formattedDateKey(day);
              const moodEntry = moods.find((m) =>
                m.formattedDate?.startsWith(key)
              );

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    w-[44px] sm:w-[56px]
                    h-[44px] sm:h-[56px]
                    rounded-[12px]
                    flex items-center justify-center
                    cursor-pointer
                    transition
                    ${
                      moodEntry
                        ? moodColors[moodEntry.mood]
                        : "bg-gray-200 dark:bg-gray-800"
                    }
                    ${
                      selectedDay === day
                        ? "ring-2 ring-accent scale-105"
                        : ""
                    }
                    text-white
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

       <div
  className="
    w-full lg:w-[420px]
    rounded-[35px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-8 sm:px-10 py-10
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
          {!selectedMood && (
            <p className="text-[16px] opacity-70">
              {lang === "en"
                ? "You haven't recorded a mood for this day yet."
                : "Ви ще не записали настрій на цей день."}
            </p>
          )}

          {selectedMood && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={`/img/${selectedMood.mood}.png`}
                alt="mood"
                className="w-16 h-16"
              />
              <p
                className={`text-lg font-semibold ${
                  selectedMood ? moodColors[selectedMood.mood] : ""
                } text-white px-4 py-1 rounded-[12px]`}
              >
                {moodTranslations[selectedMood.mood][lang]}
              </p>

              {selectedMood.note && (
                <p className="text-center opacity-80">
                  {selectedMood.note}
                </p>
              )}

              <p className="text-sm opacity-60">
                {selectedMood.formattedDate}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-6">
        <select
          value={month}
          onChange={(e) =>
            setCurrentDate(new Date(year, Number(e.target.value), 1))
          }
          className="px-6 py-3 rounded-[12px] border bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:border-accent transition"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(2024, i).toLocaleDateString(
                lang === "en" ? "en-US" : "uk-UA",
                { month: "short" }
              )}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) =>
            setCurrentDate(new Date(Number(e.target.value), month, 1))
          }
          className="px-6 py-3 rounded-[12px] border bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:border-accent transition"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const y = new Date().getFullYear() - 2 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}