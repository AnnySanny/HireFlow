import React, { useState } from "react";
import CreateVacancy from "../components/vacancy/CreateVacancy";
import VacancyList from "../components/vacancy/VacancyList";

export default function Vacancies() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [experience, setExperience] = useState("all");
  const [type, setType] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-5xl flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Пошук вакансії..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1
              border
              rounded-lg
              px-4
              py-2
              bg-white
              dark:bg-slate-800
              border-slate-300
              dark:border-slate-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/40
            "
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
    border
    rounded-lg
    px-4
    py-2
    bg-white
    text-slate-800
    border-slate-300
    dark:bg-slate-800
    dark:border-slate-700
    dark:text-white
  "
          >
            <option value="all">Всі статуси</option>
            <option value="open">Відкриті</option>
            <option value="closed">Закриті</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
    border
    rounded-lg
    px-4
    py-2
    bg-white
    text-slate-800
    border-slate-300
    dark:bg-slate-800
    dark:border-slate-700
    dark:text-white
  "
          >
            <option value="all">Тип зайнятості</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="
    border
    rounded-lg
    px-4
    py-2
    bg-white
    text-slate-800
    border-slate-300
    dark:bg-slate-800
    dark:border-slate-700
    dark:text-white
  "
          >
            <option value="all">Досвід</option>
            <option value="No experience">Без досвіду</option>
            <option value="1+ years">1+ рік</option>
            <option value="2+ years">2+ роки</option>
            <option value="3+ years">3+ роки</option>
            <option value="5+ years">5+ років</option>
            <option value="7+ years">7+ років</option>
          </select>

          <button
            onClick={() => setShowCreate(true)}
            className="
              bg-blue-500
              text-white
              px-5
              py-2
              rounded-lg
              hover:bg-blue-600
            "
          >
            Додати вакансію
          </button>
        </div>
      </div>

      <VacancyList
        search={search}
        status={status}
        type={type}
        experience={experience}
      />

      {showCreate && <CreateVacancy onClose={() => setShowCreate(false)} />}
    </div>
  );
}
