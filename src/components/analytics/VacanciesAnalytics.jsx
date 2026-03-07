import React, { useMemo } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function VacanciesAnalytics({ vacancies, isDark }) {

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
    "#14b8a6",
    "#ec4899",
    "#22c55e",
  ];

  const chartData = useMemo(() => {

    const byTitle = {};
    const byType = {};
    const byCompany = {};
    const bySalary = {
      "<1000": { value: 0, titles: [] },
      "1000-2000": { value: 0, titles: [] },
      "2000+": { value: 0, titles: [] },
    };

    vacancies.forEach((v) => {

      const title = v.title || "Вакансія";

      if (!byTitle[title]) {
        byTitle[title] = { value: 0 };
      }

      byTitle[title].value += v.candidatesCount || 0;

      const type = v.type || "Unknown";

      if (!byType[type]) {
        byType[type] = { value: 0, titles: [] };
      }

      byType[type].value++;
      byType[type].titles.push(title);

      const company = v.company || "Unknown";

      if (!byCompany[company]) {
        byCompany[company] = { value: 0, titles: [] };
      }

      byCompany[company].value++;
      byCompany[company].titles.push(title);

      const salary = v.salary || 0;

      let key = "<1000";

      if (salary >= 2000) key = "2000+";
      else if (salary >= 1000) key = "1000-2000";

      bySalary[key].value++;
      bySalary[key].titles.push(title);

    });

    const convert = (obj) =>
      Object.keys(obj).map((k) => ({
        name: k,
        value: obj[k].value,
        titles: obj[k].titles || [],
      }));

    return {
      titles: Object.keys(byTitle).map((k) => ({
        name: k,
        value: byTitle[k].value,
      })),
      type: convert(byType),
      company: convert(byCompany),
      salary: convert(bySalary),
    };

  }, [vacancies]);

  const renderTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div
      style={{
        background: isDark ? "#0f172a" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        borderRadius: "10px",
        padding: "10px",
        fontSize: "13px",
        maxWidth: "220px",
        color: isDark ? "#e2e8f0" : "#0f172a",
        wordBreak: "break-word",
        whiteSpace: "normal"
      }}
    >
      <div style={{ fontWeight: 600 }}>
        {data.name}
      </div>

      <div style={{ marginTop: 4 }}>
        {data.value}
      </div>

{data.titles && data.titles.length > 0 && (
  <div style={{ marginTop: 6, opacity: 0.8 }}>
    {data.titles.slice(0, 5).map((t, i) => (
      <div key={i}>{t}</div>
    ))}
    {data.titles.length > 5 && <div>...</div>}
  </div>
)}
    </div>
  );
};

  const renderChart = (data, title, total) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">

      <h3 className="font-medium mb-4 text-sm text-slate-600 dark:text-slate-300">
        {title}
      </h3>

      <div className="relative h-[220px]">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

<Tooltip
  content={renderTooltip}
  allowEscapeViewBox={{ x: true, y: true }}
  wrapperStyle={{ zIndex: 1000, pointerEvents: "none" }}
  position={{ y: 0 }}
/>
          </PieChart>

        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <span className="text-2xl font-semibold">
            {total}
          </span>

          <span className="text-xs text-slate-500">
            вакансій
          </span>

        </div>

      </div>

    </div>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {renderChart(
        chartData.titles,
        "Кандидати по вакансіях",
        vacancies.length
      )}

      {renderChart(
        chartData.type,
        "Тип зайнятості",
        vacancies.length
      )}
      {renderChart(
        chartData.company,
        "Компанії",
        vacancies.length
      )}
            {renderChart(
        chartData.salary,
        "Розподіл зарплат",
        vacancies.length
      )}

    </div>
  );
}