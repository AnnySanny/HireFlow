import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import ActivityChart from "../components/dashboard/ActivityChart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const isDark = document.documentElement.classList.contains("dark");
  const [vacancies, setVacancies] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const unsubVacancies = onSnapshot(collection(db, "vacancies"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVacancies(data);
    });

    const unsubCandidates = onSnapshot(collection(db, "candidates"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCandidates(data);
    });

    return () => {
      unsubVacancies();
      unsubCandidates();
    };
  }, []);

  if (!user) {
    return <div className="p-10 text-2xl font-semibold">Привіт</div>;
  }

  const myVacancies = vacancies.filter((v) => v.createdBy === user.uid);
  const myCandidates = candidates.filter((c) => c.createdBy === user.uid);

  const openVacancies = myVacancies.filter((v) => v.status === "open").length;
  const closedVacancies = myVacancies.filter(
    (v) => v.status === "closed",
  ).length;

  const vacancyChart = [
    { name: "Відкриті", value: openVacancies, color: "#22c55e" },
    { name: "Закриті", value: closedVacancies, color: "#ef4444" },
  ];

  const pipelineChart = [
    {
      name: "1 співб.",
      value: myCandidates.filter((c) => c.status === "interview1").length,
      color: "#3b82f6",
    },
    {
      name: "2 співб.",
      value: myCandidates.filter((c) => c.status === "interview2").length,
      color: "#6366f1",
    },
    {
      name: "Тест",
      value: myCandidates.filter((c) => c.status === "test").length,
      color: "#eab308",
    },
    {
      name: "Офер",
      value: myCandidates.filter((c) => c.status === "offer").length,
      color: "#22c55e",
    },
    {
      name: "Найнято",
      value: myCandidates.filter((c) => c.status === "hired").length,
      color: "#10b981",
    },
    {
      name: "Відхилено",
      value: myCandidates.filter((c) => c.status === "rejected").length,
      color: "#ef4444",
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold mb-6">Вакансії</h2>

          <div className="relative h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={vacancyChart}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {vacancyChart.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

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
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-semibold">
                {myVacancies.length}
              </span>

              <span className="text-sm text-slate-500">всього</span>
            </div>
          </div>
        </div>



        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold mb-6">Pipeline кандидатів</h2>

          <div className="relative h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pipelineChart}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {pipelineChart.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

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
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-semibold">
                {myCandidates.length}
              </span>

              <span className="text-sm text-slate-500">всього</span>
            </div>
          </div>
        </div>
      </div>

<ActivityChart
  vacancies={myVacancies}
  candidates={myCandidates}
  isDark={isDark}
/>
    </div>
  );
}
