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

export default function MonthChart() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();
    const { mode } = useTheme();
const isDark = mode === "dark";
  const [moods, setMoods] = useState([]);

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
    const month = now.getMonth();
    const year = now.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // межі місяця
    const startOfMonth = new Date(year, month, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(year, month + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthMoods = moods.filter(
      (m) =>
        m.createdAt &&
        m.createdAt >= startOfMonth &&
        m.createdAt <= endOfMonth
    );

    const dayMap = {};

    monthMoods.forEach((m) => {
      const d = m.createdAt.getDate();

      if (
        !dayMap[d] ||
        m.createdAt > dayMap[d].createdAt
      ) {
        dayMap[d] = m;
      }
    });

    return Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      return {
        day,
        value: dayMap[day]
          ? moodRank[dayMap[day].mood] || null
          : null,
      };
    });
  }, [moods]);

  const levelLabels =
    lang === "en"
      ? { 1: "Sad", 2: "Low", 3: "Neutral", 4: "Good", 5: "Great" }
      : { 1: "Погано", 2: "Низько", 3: "Нейтрально", 4: "Добре", 5: "Чудово" };

  return (
<div
  className="
    w-full max-w-[950px]
    rounded-[35px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    px-8 py-10
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
      <h3 className="mb-8 text-[18px] text-accent font-medium">
        {lang === "en"
          ? "Monthly Mood Level"
          : "Рівень настрою за місяць"}
      </h3>

      <div className="h-[360px] w-full">
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
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}