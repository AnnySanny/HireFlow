import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
const moodRank = {
  great: 5,
  good: 4,
  excited: 4,
  calm: 3,
  surprised: 3,
  bored: 3,
  sleepy: 2,
  anxious: 2,
  upset: 2,
  sad: 1,
  annoyed: 1,
  angry: 1,
};

export default function WeeklyMoodChart() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();
    const { mode } = useTheme();
const isDark = mode === "dark";
  const [moods, setMoods] = useState([]);

  const days = useMemo(() => {
    return lang === "en"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
  }, [lang]);

  useEffect(() => {
    if (!user) return;

    const fetchMoods = async () => {
      const q = query(
        collection(db, "moods"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          ...d,
          createdAt: d.createdAt?.toDate(),
        };
      });

      setMoods(data);
    };

    fetchMoods();
  }, [user]);

  const data = useMemo(() => {
    const now = new Date();

    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekMoods = moods.filter(
      (m) =>
        m.createdAt &&
        m.createdAt >= startOfWeek &&
        m.createdAt <= endOfWeek
    );

    const dayMap = {};

    weekMoods.forEach((m) => {
      const d = new Date(m.createdAt);
      let weekday = d.getDay();
      weekday = weekday === 0 ? 6 : weekday - 1;

      if (
        !dayMap[weekday] ||
        m.createdAt > dayMap[weekday].createdAt
      ) {
        dayMap[weekday] = m;
      }
    });

    return days.map((label, index) => ({
      day: label,
      value: dayMap[index]
        ? moodRank[dayMap[index].mood] || null
        : null,
    }));
  }, [moods, days]);

  const levelLabels =
    lang === "en"
      ? { 1: "Sad", 2: "Low", 3: "Neutral", 4: "Good", 5: "Great" }
      : { 1: "Погано", 2: "Низько", 3: "Нейтрально", 4: "Добре", 5: "Чудово" };

  return (
    <div className="
      w-full max-w-[900px]
      rounded-[35px]
      border
      px-8 py-10
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-white
    ">
      <h3 className="text-[18px] tracking-wide mb-8 text-accent font-medium">
        {lang === "en"
          ? "Weekly Mood Level"
          : "Рівень настрою за тиждень"}
      </h3>

      <div className="h-[340px] w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={0.2}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(tick) => levelLabels[tick]}
              axisLine={false}
              tickLine={false}
            />

           
            {[1, 2, 3, 4, 5].map((lvl) => (
              <ReferenceLine
                key={lvl}
                y={lvl}
                stroke="var(--accent)"
                strokeOpacity={0.05}
              />
            ))}

<Tooltip
  formatter={(value) => [
    levelLabels[value],
    lang === "en" ? "Mood" : "Настрій",
  ]}
  contentStyle={{
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    border: `1px solid ${
      isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
    }`,
    borderRadius: "14px",
    boxShadow: isDark
      ? "0 4px 20px rgba(0,0,0,0.6)"
      : "0 4px 20px rgba(0,0,0,0.08)",
    color: isDark ? "#f8fafc" : "#0f172a",
  }}
/>

            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--accent)"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}