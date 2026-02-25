import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import MoodInsights from "../components/statistics/MoodInsights";
import WeekChart from "../components/statistics/WeekChart";
import MonthChart from "../components/statistics/MonthChart";

export default function Statistics() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();

  const [view, setView] = useState("month");
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) return;

    const fetchMoods = async () => {
      try {
        const q = query(
          collection(db, "moods"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMoods(data);
      } catch (err) {
        console.error("Error loading moods:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, [user]);


  const filteredMoods = useMemo(() => {
    if (!moods.length) return [];

    const now = new Date();

    if (view === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 6);

      return moods.filter(m => {
        if (!m.createdAt) return false;
        const d = m.createdAt.toDate();
        return d >= weekAgo;
      });
    }

 
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return moods.filter(m => {
      if (!m.createdAt) return false;
      const d = m.createdAt.toDate();
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

  }, [moods, view]);

  if (loading) {
    return (
      <div className="w-full flex justify-center pt-20">
        {lang === "en" ? "Loading..." : "Завантаження..."}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-12 pb-20 px-4">

   
      <MoodInsights moods={filteredMoods} period={view} />

   
      {view === "week" ? (
        <WeekChart moods={filteredMoods} />
      ) : (
        <MonthChart moods={filteredMoods} />
      )}

      <div className="mt-10 w-full max-w-[500px] flex gap-6">
        <button
          onClick={() => setView("week")}
          className={`w-full px-6 py-3 rounded-full border transition ${
            view === "week"
              ? "bg-accent text-white border-accent"
              : "border-accent text-accent hover:bg-accent hover:text-white"
          }`}
        >
          {lang === "en" ? "This week" : "Цей тиждень"}
        </button>

        <button
          onClick={() => setView("month")}
          className={`w-full px-6 py-3 rounded-full border transition ${
            view === "month"
              ? "bg-accent text-white border-accent"
              : "border-accent text-accent hover:bg-accent hover:text-white"
          }`}
        >
          {lang === "en" ? "This month" : "Цей місяць"}
        </button>
      </div>

    </div>
  );
}