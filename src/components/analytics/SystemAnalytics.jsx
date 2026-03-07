import React, { useMemo } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export default function SystemAnalytics({ candidates, isDark }) {

  const tooltipStyle = {
    background: isDark ? "#0f172a" : "#ffffff",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    borderRadius: "10px",
    color: isDark ? "#e2e8f0" : "#0f172a",
  };


  const funnelData = useMemo(() => {

    const map = {
      waiting: 0,
      interview1: 0,
      interview2: 0,
      test: 0,
      offer: 0,
      hired: 0,
    };

    candidates.forEach((c) => {
      if (map[c.status] !== undefined) {
        map[c.status]++;
      }
    });

    return [
      { name: "Кандидати", value: map.waiting },
      { name: "1 співбесіда", value: map.interview1 },
      { name: "2 співбесіда", value: map.interview2 },
      { name: "Тестове завдання", value: map.test },
      { name: "Офер", value: map.offer },
      { name: "Найнято", value: map.hired },
    ];

  }, [candidates]);



  const hiringStats = useMemo(() => {

    const total = candidates.length;

    const hired = candidates.filter(
      (c) => c.status === "hired"
    ).length;

    const rate = total ? Math.round((hired / total) * 100) : 0;

    return { total, hired, rate };

  }, [candidates]);


  const rejectionStats = useMemo(() => {

    const total = candidates.length;

    const rejected = candidates.filter(
      (c) => c.status === "rejected"
    ).length;

    const rate = total ? Math.round((rejected / total) * 100) : 0;

    return { total, rejected, rate };

  }, [candidates]);


const colors = [
  "#e5e7eb",
  "#3b82f6", 
  "#6366f1", 
  "#eab308", 
  "#22c55e", 
  "#10b981", 
];


  return (
    <div className="grid gap-6 lg:grid-cols-2">


      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col justify-center">

        <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Hiring Rate
        </h3>

        <div className="text-5xl font-semibold text-green-500 mb-3">
          {hiringStats.rate}%
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">

          Метрика показує, який відсоток кандидатів було
          <span className="text-green-600 font-semibold"> успішно найнято</span>.

          <br/><br/>

          Формула:

          <br/>

          <span className="font-semibold text-slate-700 dark:text-slate-200">
            найняті кандидати / всі кандидати × 100
          </span>

          <br/><br/>

У системі:

<br/>

<span className="text-green-600 font-semibold text-lg">
  {hiringStats.hired}
</span>
{" "}
<span className="text-base">
  найнято з
</span>
{" "}
<span className="font-semibold text-lg">
  {hiringStats.total}
</span>
{" "}
<span className="text-base">
  кандидатів.
</span>

        </p>

      </div>



      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col justify-center">

        <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Rejection Rate
        </h3>

        <div className="text-5xl font-semibold text-red-500 mb-3">
          {rejectionStats.rate}%
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">

          Показує відсоток кандидатів, які були
          <span className="text-red-500 font-semibold"> відхилені</span>.

          <br/><br/>

          Формула:

          <br/>

          <span className="font-semibold text-slate-700 dark:text-slate-200">
            відхилені кандидати / всі кандидати × 100
          </span>

          <br/><br/>

У системі:

<br/>

<span className="text-red-500 font-semibold text-lg">
  {rejectionStats.rejected}
</span>
{" "}
<span className="text-base">
  відхилено з
</span>
{" "}
<span className="font-semibold text-lg">
  {rejectionStats.total}
</span>
{" "}
<span className="text-base">
  кандидатів.
</span>

        </p>

      </div>

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">

  <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">
    Етапи рекрутингу
  </h3>

  <div className="h-[320px]">

    <ResponsiveContainer>

      <BarChart
        data={funnelData}
        layout="vertical"
        margin={{ left: 20 }}
      >

        <CartesianGrid
          strokeDasharray="2 4"
          stroke={isDark ? "#334155" : "#e2e8f0"}
        />

        <XAxis type="number" />

        <YAxis
          dataKey="name"
          type="category"
          width={160}
        />

        <Tooltip contentStyle={tooltipStyle} />

        <Bar
          dataKey="value"
          radius={[0,8,8,0]}
        >
          {funnelData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Bar>

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

    </div>
  );
}