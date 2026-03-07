import React, { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { RefreshCw, Pencil, Trash2 } from "lucide-react";
import CreateVacancy from "./CreateVacancy";
export default function VacancyCard({ vacancy }) {
    const typeMap = {
  "Full-time": "Full-time (Повна зайнятість)",
  "Part-time": "Part-time (Часткова зайнятість)",
  "Contract": "Contract (Контракт)",
  "Internship": "Internship (Стажування)",
};

const experienceMap = {
  "No experience": "Без досвіду",
  "1+ years": "1+ рік",
  "2+ years": "2+ роки",
  "3+ years": "3+ роки",
  "5+ years": "5+ років",
  "7+ years": "7+ років",
};
const statusColor =
  vacancy.status === "open"
    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

  const deadlineDate = new Date(vacancy.deadline).toLocaleDateString();
const [editOpen, setEditOpen] = useState(false);
  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  };

  const handleStatusChange = async () => {
    const newStatus = vacancy.status === "open" ? "closed" : "open";

    await updateDoc(doc(db, "vacancies", vacancy.id), {
      status: newStatus,
    });

    toast("success", "Статус змінено");
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Видалити вакансію?",
      text: "Цю дію неможливо скасувати",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
    });

    if (!result.isConfirmed) return;

    await deleteDoc(doc(db, "vacancies", vacancy.id));

    toast("success", "Вакансію видалено");
  };

  return (
    <div
      className="
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-700
        rounded-xl
        p-6
        shadow-sm
        hover:shadow-md
        transition
      "
    >

      <div className="flex justify-between items-start mb-4">

        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-semibold break-words">
            {vacancy.title}
          </h2>

          <span
            className={`
              px-3
              py-1
              text-xs
              rounded-full
              font-medium
              ${statusColor}
            `}
          >
            {vacancy.status === "open" ? "Відкрита" : "Закрита"}
          </span>
        </div>


        <div className="flex items-center gap-2">

          <button
            onClick={handleStatusChange}
            className="
              p-2
              rounded-lg
              text-blue-500
              hover:bg-blue-100
              dark:hover:bg-slate-800
              transition
            "
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={() => setEditOpen(true)}
            className="
              p-2
              rounded-lg
              text-green-500
              hover:bg-green-100
              dark:hover:bg-slate-800
              transition
            "
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={handleDelete}
            className="
              p-2
              rounded-lg
              text-red-500
              hover:bg-red-100
              dark:hover:bg-slate-800
              transition
            "
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>
                {editOpen && (
  <CreateVacancy
    vacancy={vacancy}
    onClose={() => setEditOpen(false)}
  />
)}

      <p className="text-sm text-slate-500 mb-4">
        {vacancy.company} • {vacancy.department}
      </p>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">

        <div>
          <span className="text-slate-500">Локація:</span>
          <div className="break-words">{vacancy.location}</div>
        </div>

        <div>
        <span className="text-slate-500">Зайнятість:</span>
        <div>{typeMap[vacancy.type] || vacancy.type}</div>
        </div>

        <div>
        <span className="text-slate-500">Досвід:</span>
        <div>{experienceMap[vacancy.experience] || vacancy.experience}</div>
        </div>
        <div>
          <span className="text-slate-500">Зарплата:</span>
          <div>${vacancy.salary}</div>
        </div>
      <div>
          <span className="text-slate-500">Вимоги:</span>
          <div>{vacancy.requirements}</div>
        </div>
      </div>
  
 <span className="text-slate-500">Опис ваканції:</span>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
        {vacancy.description}
      </p>


      <div className="flex justify-between items-center text-sm flex-wrap gap-2">

        <div className="text-slate-500">
          Кандидати: <b>{vacancy.candidatesCount}</b>
        </div>

        <div className="text-slate-500">
          Дедлайн: {deadlineDate}
        </div>

      </div>

    </div>
  );
}