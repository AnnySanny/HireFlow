import React from "react";

export default function CandidateModal({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-700
        rounded-xl
        shadow-xl
        w-full
        max-w-md
        p-6
        relative
      "
      >
        <button
          onClick={onClose}
          className="
          absolute
          top-3
          right-3
          text-slate-400
          hover:text-slate-600
          dark:hover:text-slate-200
        "
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              candidate.photo ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={candidate.name}
            className="w-16 h-16 rounded-full object-cover"
          />

          <div>
            <h2 className="text-lg font-semibold leading-none">
              {candidate.name}
            </h2>

            <div className="text-sm text-slate-500 mt-1">
              {candidate.vacancyTitle || "Без вакансії"}
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <div className="text-slate-500 text-xs mb-1">Телефон</div>

            <div>{candidate.phone || "—"}</div>
          </div>

          <div>
            <div className="text-slate-500 text-xs mb-1">Email</div>

            <div className="break-words">{candidate.email || "—"}</div>
          </div>

          <div>
            <div className="text-slate-500 text-xs mb-1">
              Резюме / портфоліо
            </div>

            {candidate.resume ? (
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="
                text-blue-500
                hover:underline
              "
              >
                Переглянути
              </a>
            ) : (
              <span className="text-slate-400">Відсутнє</span>
            )}
          </div>

          <div>
            <div className="text-slate-500 text-xs mb-1">Коментар</div>

            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {candidate.comments && candidate.comments.trim() !== "" ? (
                candidate.comments
              ) : (
                <span className="text-slate-400">Коментар відсутній</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="
            px-4
            py-2
            rounded-lg
            bg-blue-600
            text-white
            hover:bg-blue-700
            transition
          "
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
