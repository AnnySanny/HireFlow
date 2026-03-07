import React, { useMemo } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CandidatesAnalytics({ candidates, vacancies, isDark }) {

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
const statusMap = {
  waiting: "Кандидат",
  interview1: "1-ша співбесіда",
  interview2: "2-га співбесіда",
  test: "Тестове завдання",
  offer: "Офер",
  hired: "Найнято",
  rejected: "Відхилено",
  unknown: "Невідомо",
};
  const vacancyMap = useMemo(() => {
    const map = {};
    vacancies.forEach((v) => {
      map[v.id] = v;
    });
    return map;
  }, [vacancies]);

  const chartData = useMemo(() => {

    const byStatus = {};
    const byType = {};
    const byCompany = {};

    candidates.forEach((c) => {

      const name = c.name || "Кандидат";

        const status = statusMap[c.status] || statusMap["unknown"];
      if (!byStatus[status]) {
        byStatus[status] = { value: 0, names: [] };
      }

      byStatus[status].value++;
      byStatus[status].names.push(name);

      const vacancy = vacancyMap[c.vacancyId];

      const type = vacancy?.type || "Unknown";

      if (!byType[type]) {
        byType[type] = { value: 0, names: [] };
      }

      byType[type].value++;
      byType[type].names.push(name);

      const company = vacancy?.company || "Unknown";

      if (!byCompany[company]) {
        byCompany[company] = { value: 0, names: [] };
      }

      byCompany[company].value++;
      byCompany[company].names.push(name);

    });

    const convert = (obj) =>
      Object.keys(obj).map((k) => ({
        name: k,
        value: obj[k].value,
        names: obj[k].names,
      }));

    return {
      status: convert(byStatus),
      type: convert(byType),
      company: convert(byCompany),
    };

  }, [candidates, vacancyMap]);

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
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {data.name}
        </div>

        <div style={{ marginTop: 4 }}>
          {data.value}
        </div>

        {data.names && (
          <div style={{ marginTop: 6, opacity: 0.8 }}>
            {data.names.slice(0, 5).map((n, i) => (
              <div key={i}>{n}</div>
            ))}
            {data.names.length > 10 && <div>...</div>}
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
            кандидатів
          </span>

        </div>

      </div>

    </div>
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

      {renderChart(
        chartData.status,
        "Кандидати за статусом",
        candidates.length
      )}

      {renderChart(
        chartData.type,
        "Тип вакансії",
        candidates.length
      )}

      {renderChart(
        chartData.company,
        "Компанії",
        candidates.length
      )}

    </div>
  );
}