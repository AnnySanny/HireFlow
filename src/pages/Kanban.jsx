import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import CandidateModal from "../components/candidates/CandidateModal";
import { HelpCircle, X } from "lucide-react";
export default function Kanban() {
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const [dragOver, setDragOver] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const columns = [
    {
      name: "1-ша співбесіда",
      status: "interview1",
      color:
        "bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:border-blue-700",
    },
    {
      name: "2-га співбесіда",
      status: "interview2",
      color:
        "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-700",
    },
    {
      name: "Тестове завдання",
      status: "test",
      color:
        "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/40 dark:border-yellow-700",
    },
    {
      name: "Офер",
      status: "offer",
      color:
        "bg-green-100 border-green-300 dark:bg-green-900/40 dark:border-green-700",
    },
    {
      name: "Найнято",
      status: "hired",
      color:
        "bg-emerald-200 border-emerald-400 dark:bg-emerald-900/40 dark:border-emerald-700",
    },
    {
      name: "Відхилено",
      status: "rejected",
      color: "bg-red-100 border-red-300 dark:bg-red-900/40 dark:border-red-700",
    },
  ];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1400);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "candidates"),
      where("createdBy", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        vacancy: doc.data().vacancyTitle,
      }));

      const waiting = data.filter((c) => c.status === "waiting");

      const newBoard = {
        "1-ша співбесіда": data.filter((c) => c.status === "interview1"),
        "2-га співбесіда": data.filter((c) => c.status === "interview2"),
        "Тестове завдання": data.filter((c) => c.status === "test"),
        Офер: data.filter((c) => c.status === "offer"),
        Найнято: data.filter((c) => c.status === "hired"),
        Відхилено: data.filter((c) => c.status === "rejected"),
      };

      setCandidates(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDragStart = (e, candidate, from) => {
    const payload = { candidate, from };
    e.dataTransfer.setData("candidate", JSON.stringify(payload));
  };

  const handleDrop = async (e, column, status) => {
    const data = JSON.parse(e.dataTransfer.getData("candidate"));
    const { candidate } = data;

    await updateDoc(doc(db, "candidates", candidate.id), {
      status: status,
    });
  };
  const handleDropPool = async (e) => {
    const data = JSON.parse(e.dataTransfer.getData("candidate"));
    const { candidate } = data;

    await updateDoc(doc(db, "candidates", candidate.id), {
      status: "waiting",
    });
  };

  const allowDrop = (e) => e.preventDefault();

  const filterCandidate = (c) => {
    const q = search.toLowerCase();

    return (
      c.name?.toLowerCase().includes(q) || c.vacancy?.toLowerCase().includes(q)
    );
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-center px-6">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Kanban недоступний</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Канбан дошка не підтримується на даній роздільній здатності екрану.
            Приносимо вибачення за незручності.
          </p>
        </div>
      </div>
    );
  }

  return (

    <div className="p-6 max-w-[1400px] mx-auto">

      <div className="mb-6">
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

    <div className="flex items-center gap-3 w-full md:w-auto">
      <button
        onClick={() => setShowGuide((prev) => !prev)}
        className="
          shrink-0
          flex items-center justify-center
          w-11 h-11
          rounded-xl
          border border-blue-200 dark:border-blue-800
          bg-white dark:bg-slate-900
          text-blue-600 dark:text-blue-400
          hover:bg-blue-50 dark:hover:bg-slate-800
          transition
          shadow-sm
        "
        title="Показати інструкцію"
      >
        <HelpCircle size={20} />
      </button>

      <input
        type="text"
        placeholder="Пошук кандидатів або дошок..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full md:w-[320px]
          rounded-xl
          border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900
          px-4 py-3
          text-sm text-slate-700 dark:text-slate-200
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          outline-none
          focus:ring-2 focus:ring-blue-400/40
          focus:border-blue-400
          transition
        "
      />
    </div>
  </div>

  {showGuide && (
    <div
      className="
        mt-4
        p-5
        rounded-2xl
        border border-blue-200 dark:border-blue-900
        bg-blue-50 dark:bg-slate-900
        shadow-sm
        relative
        animate-in fade-in slide-in-from-top-2 duration-300
      "
    >
      <button
        onClick={() => setShowGuide(false)}
        className="
          absolute top-3 right-3
          p-1.5
          rounded-lg
          text-slate-500 dark:text-slate-400
          hover:bg-blue-100 dark:hover:bg-slate-800
          transition
        "
        title="Приховати"
      >
        <X size={16} />
      </button>

      <div className="pr-8">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3">
          Як працювати з канбан-дошкою
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Перетягуйте картки кандидатів між дошками за допомогою
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> ЛКМ </span>
          щоб змінювати етап рекрутингу.
          <br />
          <br />
          Натисніть
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> ЛКМ по картці кандидата </span>
          щоб переглянути детальну інформацію.
          <br />
          <br />
          При переміщенні картки її
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> статус автоматично оновлюється </span>
          відповідно до вибраної дошки.
          <br />
          <br />
          Поле пошуку дозволяє
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> швидко знаходити кандидатів </span>
          або потрібні етапи рекрутингу.
          <br />
          <br />
          Для закриття інструкції натисніть
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> кнопку приховати </span>
          або іконку
          <span className="text-blue-600 dark:text-blue-400 font-semibold"> × </span>.
        </p>

        <div className="mt-4">
          <button
            onClick={() => setShowGuide(false)}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium
              transition
            "
          >
            Приховати
          </button>
        </div>
      </div>
    </div>
  )}
</div>

      <div className="flex gap-6">
        <div
          className="w-[220px] flex-shrink-0"
          onDragOver={allowDrop}
          onDrop={handleDropPool}
        >
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            Кандидати
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded">
              {
                candidates
                  .filter((c) => c.status === "waiting")
                  .filter(filterCandidate).length
              }
            </span>
          </h2>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {candidates
              .filter((c) => c.status === "waiting")
              .filter(filterCandidate)
              .map((c) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, c, "pool")}
                  onClick={() => setSelectedCandidate(c)}
                  className="
                    flex items-center gap-2
                    p-2
                    rounded-lg
                    border
                    border-slate-200
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-900
                    cursor-move
                    hover:shadow
                  "
                >
                  <img
                    src={c.photo}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div className="text-xs">
                    <div className="font-medium leading-none">{c.name}</div>

                    <div className="text-slate-500">{c.vacancy}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-6">
          {columns.map((col) => {
            const filtered = candidates
              .filter((c) => c.status === col.status)
              .filter(filterCandidate);

            return (
              <div
                key={col.name}
                onDragOver={(e) => {
                  allowDrop(e);
                  setDragOver(col.name);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  handleDrop(e, col.name, col.status);
                  setDragOver(null);
                }}
                className={`
                  border
                  rounded-xl
                  p-4
                  min-h-[260px]
                  flex flex-col
                  transition
                  ${col.color}
                  ${dragOver === col.name ? "ring-2 ring-blue-500 scale-[1.02]" : ""}
                `}
              >
                <h3 className="font-semibold mb-4 text-sm flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  {col.name}

                  <span className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded">
                    {filtered.length}
                  </span>
                </h3>

                <div className="grid grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600">
                  {filtered.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c, col.name)}
                      onClick={() => setSelectedCandidate(c)}
                      className="
                        flex items-center gap-2
                        p-2
                        rounded-lg
                        bg-white
                        dark:bg-slate-800
                        border
                        border-slate-200
                        dark:border-slate-700
                        cursor-move
                      "
                    >
                      <img
                        src={c.photo}
                        className="w-7 h-7 rounded-full object-cover"
                      />

                      <div className="text-[11px] leading-tight">
                        <div className="font-medium">{c.name}</div>

                        <div className="text-slate-500">{c.vacancy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {selectedCandidate && (
          <CandidateModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </div>
    </div>
  );
}
