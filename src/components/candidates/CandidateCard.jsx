import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import CreateCandidate from "./CreateCandidate";

export default function CandidateCard({ candidate }) {
  const [editOpen, setEditOpen] = useState(false);
  const [vacancy, setVacancy] = useState(null);

  useEffect(() => {
    if (!candidate.vacancyId) return;

    const loadVacancy = async () => {
      const snap = await getDoc(doc(db, "vacancies", candidate.vacancyId));

      if (snap.exists()) {
        setVacancy(snap.data());
      }
    };

    loadVacancy();
  }, [candidate.vacancyId]);
  const statusMap = {
    waiting: "Кандидат",
    interview1: "1-ша співбесіда",
    interview2: "2-га співбесіда",
    test: "Тестове завдання",
    offer: "Офер",
    hired: "Найнято",
    rejected: "Відхилено",
  };

  const statusColor = {
    waiting:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",

    interview1:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",

    interview2:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",

    test: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",

    offer:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",

    hired:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",

    rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

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

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Видалити кандидата?",
      text: "Цю дію неможливо скасувати",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "candidates", candidate.id));
      toast("success", "Кандидата видалено");
    } catch (error) {
      toast("error", "Помилка видалення");
      console.error(error);
    }
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
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          <img
            src={
              candidate.photo ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={candidate.name}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">{candidate.name}</h2>

            <span
              className={`
                px-3
                py-1
                text-xs
                rounded-full
                font-medium
                ${statusColor[candidate.status]}
              `}
            >
              {statusMap[candidate.status]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="
              p-2
              rounded-lg
              text-green-500
              hover:bg-green-100
              dark:hover:bg-slate-800
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
            "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {editOpen && (
        <CreateCandidate
          candidate={candidate}
          onClose={() => setEditOpen(false)}
        />
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mb-5">
        <div>
          <span className="text-slate-500">Телефон:</span>
          <div>{candidate.phone}</div>
        </div>

        <div>
          <span className="text-slate-500">Email:</span>
          <div className="break-words">{candidate.email}</div>
        </div>

        <div>
          <span className="text-slate-500">Вакансія:</span>
          <div>
            {vacancy ? `${vacancy.title} • ${vacancy.company}` : "Без вакансії"}
          </div>
        </div>

        <div>
          <span className="text-slate-500">Резюме / портфоліо:</span>

          <div>
            {candidate.resume ? (
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Переглянути
              </a>
            ) : (
              <span className="text-slate-400">Відсутнє</span>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm">
        <span className="text-slate-500">Коментарі:</span>

        <div className="mt-1 text-slate-700 dark:text-slate-300">
          {candidate.comments && candidate.comments.trim() !== "" ? (
            <p>{candidate.comments}</p>
          ) : (
            <span className="text-slate-400">Коментарі відсутні</span>
          )}
        </div>
      </div>
    </div>
  );
}
