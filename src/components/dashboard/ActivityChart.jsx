import React, { useState, useMemo } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function ActivityChart({ vacancies, candidates, isDark }) {

  const [range, setRange] = useState("all");

  const data = useMemo(() => {

    const now = new Date();

    const map = {};

    const format = (date) => {
      return date.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
      });
    };

    const checkRange = (date) => {

      if (range === "7") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return date >= weekAgo;
      }

      if (range === "30") {
        const monthAgo = new Date();
        monthAgo.setDate(now.getDate() - 30);
        return date >= monthAgo;
      }

      return true;
    };

    vacancies.forEach((v) => {

      if (!v.createdAt) return;

      const date = v.createdAt.toDate();

      if (!checkRange(date)) return;

      const key = format(date);

      if (!map[key]) {
        map[key] = { date: key, vacancies: 0, candidates: 0 };
      }

      map[key].vacancies++;

    });

    candidates.forEach((c) => {

      if (!c.createdAt) return;

      const date = c.createdAt.toDate();

      if (!checkRange(date)) return;

      const key = format(date);

      if (!map[key]) {
        map[key] = { date: key, vacancies: 0, candidates: 0 };
      }

      map[key].candidates++;

    });

    const sorted = Object.values(map).sort((a, b) => {

      const [d1, m1] = a.date.split(".");
      const [d2, m2] = b.date.split(".");

      const date1 = new Date(2024, m1 - 1, d1);
      const date2 = new Date(2024, m2 - 1, d2);

      return date1 - date2;

    });

    return sorted;

  }, [vacancies, candidates, range]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">


      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">

        <h2 className="font-semibold">
          Активність системи
        </h2>

        <div className="flex gap-2">

          <button
            onClick={() => setRange("all")}
            className={`
              px-3 py-1.5 rounded-lg text-sm
              transition
              ${range === "all"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
            `}
          >
            Весь час
          </button>

          <button
            onClick={() => setRange("30")}
            className={`
              px-3 py-1.5 rounded-lg text-sm
              transition
              ${range === "30"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
            `}
          >
            30 днів
          </button>

          <button
            onClick={() => setRange("7")}
            className={`
              px-3 py-1.5 rounded-lg text-sm
              transition
              ${range === "7"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }
            `}
          >
            7 днів
          </button>

        </div>

      </div>



      <div className="h-[320px]">

        <ResponsiveContainer>

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={0.2}
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
                fill: isDark ? "#cbd5f5" : "#475569",
              }}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fontSize: 12,
                fill: isDark ? "#cbd5f5" : "#475569",
              }}
            />

            <Tooltip
              contentStyle={{
                background: isDark ? "#0f172a" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "10px",
                color: isDark ? "#e2e8f0" : "#0f172a",
              }}
              labelStyle={{
                color: isDark ? "#94a3b8" : "#475569",
              }}
              itemStyle={{
                color: isDark ? "#e2e8f0" : "#0f172a",
              }}
              cursor={{
                fill: isDark
                  ? "rgba(148,163,184,0.1)"
                  : "rgba(148,163,184,0.15)",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="vacancies"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Вакансії"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="candidates"
              stroke="#10b981"
              strokeWidth={3}
              name="Кандидати"
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}