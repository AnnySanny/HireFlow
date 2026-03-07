import React, { useState } from "react";
import CandidatesList from "../components/candidates/CandidatesList";
import CreateCandidate from "../components/candidates/CreateCandidate";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
export default function Candidates() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [vacancy, setVacancy] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "vacancies"), where("status", "==", "open"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVacancies(data);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="p-8">

      <div className="flex justify-center mb-10">
        <div className="w-full max-w-5xl flex flex-wrap gap-4 items-center">

          <input
            type="text"
            placeholder="Пошук кандидата..."
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
            <option value="waiting">Кандидат</option>
            <option value="interview1">1-ша співбесіда</option>
            <option value="interview2">2-га співбесіда</option>
            <option value="test">Тестове завдання</option>
            <option value="offer">Офер</option>
            <option value="hired">Найнято</option>
            <option value="rejected">Відхилено</option>
          </select>

 
          <select
            value={vacancy}
            onChange={(e) => setVacancy(e.target.value)}
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
            <option value="all">Всі вакансії</option>
            <option value="none">Без вакансії</option>

            {vacancies.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
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
            Додати кандидата
          </button>
        </div>
      </div>


      <CandidatesList search={search} status={status} vacancy={vacancy} />

  
      {showCreate && <CreateCandidate onClose={() => setShowCreate(false)} />}
    </div>
  );
}
