import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function DashboardHome() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [daysTracked, setDaysTracked] = useState(0);
  const [happyDays, setHappyDays] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [alreadyCheckedToday, setAlreadyCheckedToday] = useState(false);




useEffect(() => {
  if (!user) return;

  const fetchMoods = async () => {
    const q = query(
      collection(db, "moods"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    const moods = snapshot.docs.map((doc) => doc.data());

    if (!moods.length) {
      setDaysTracked(0);
      setHappyDays(0);
      setCurrentStreak(0);
      setAlreadyCheckedToday(false);
      return;
    }


    setDaysTracked(moods.length);


    const happyList = ["great", "good", "excited"];
    const happyCount = moods.filter((m) =>
      happyList.includes(m.mood)
    ).length;
    setHappyDays(happyCount);


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasToday = moods.some((m) => {
      if (!m.createdAt) return false;
      const date = m.createdAt.toDate();
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

    setAlreadyCheckedToday(hasToday);

   
  
    const uniqueDates = [
      ...new Set(
        moods
          .filter((m) => m.createdAt)
          .map((m) => {
            const date = m.createdAt.toDate();
            date.setHours(0, 0, 0, 0);
            return date.getTime();
          })
      ),
    ];

    uniqueDates.sort((a, b) => b - a);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
      const diff =
        (currentDate - uniqueDates[i]) /
        (1000 * 60 * 60 * 24);

      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }

    setCurrentStreak(streak);
  };

  fetchMoods();
}, [user]);

  const handleStartCheckIn = () => {
    if (!user) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title:
          lang === "en"
            ? "Please log in to start tracking your mood"
            : "Увійдіть в систему, щоб розпочати відстеження настрою",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: document.documentElement.classList.contains("dark")
          ? "#0f172a"
          : "#ffffff",
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#1f2937",
      });
      return;
    }

    if (alreadyCheckedToday) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title:
          lang === "en"
            ? "You've already checked in today. See you tomorrow!"
            : "Сьогоднішній настрій вже збережено. Побачимось завтра!",
        showConfirmButton: false,
        timer: 3000,
        background: document.documentElement.classList.contains("dark")
          ? "#0f172a"
          : "#ffffff",
        color: document.documentElement.classList.contains("dark")
          ? "#ffffff"
          : "#1f2937",
      });
      return;
    }

    navigate("/check-in");
  };

  return (
    <div className="w-full flex flex-col items-center pt-12 pb-20 px-4">
    <div
  className="
    w-full max-w-[900px]
    rounded-[40px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-6 sm:px-10 md:px-16
    py-10 md:py-14
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
        <div className="max-w-[600px]">
          <h2 className="text-2xl font-semibold mb-3">
            {lang === "en"
              ? "Daily Mood Check-in"
              : "Щоденна перевірка настрою"}
          </h2>

          <p className="text-base mb-8 opacity-80">
            {lang === "en"
              ? "Take a moment to reflect on how you're feeling"
              : "Зупиніться на мить і оцініть свій настрій"}
          </p>
        </div>

        <div className="w-full flex justify-center">
          <button
            onClick={handleStartCheckIn}
            className="w-full max-w-[500px] h-[56px] rounded-full border border-accent text-accent font-medium transition hover:bg-accent hover:text-white hover:scale-[1.02]"
          >
            {lang === "en"
              ? "Start today's check-in"
              : "Розпочати сьогоднішню перевірку"}
          </button>
        </div>
      </div>

      <div className="mt-20 flex flex-col sm:flex-row gap-10 sm:gap-16 md:gap-20 items-center">
        <div
  className="
    w-[220px] h-[180px]
    rounded-[30px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    flex flex-col justify-center items-center
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
          <p className="text-base mb-4 opacity-80">
            {lang === "en" ? "Days Tracked" : "Днів відстежено"}
          </p>
          <h3 className="text-5xl font-semibold text-accent">
            {daysTracked}
          </h3>
        </div>

        <div
  className="
    w-[220px] h-[180px]
    rounded-[30px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    flex flex-col justify-center items-center
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
          <p className="text-base mb-4 opacity-80">
            {lang === "en" ? "Current Streak" : "Поточна серія"}
          </p>
          <h3 className="text-5xl font-semibold text-accent">
            {currentStreak}
          </h3>
        </div>

        <div
  className="
    w-[220px] h-[180px]
    rounded-[30px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    flex flex-col justify-center items-center
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
          <p className="text-base mb-4 opacity-80">
            {lang === "en" ? "Happy days" : "Щасливі дні"}
          </p>
          <h3 className="text-5xl font-semibold text-accent">
            {happyDays}
          </h3>
        </div>
      </div>
    </div>
  );
}