import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

import CandidatesAnalytics from "../components/analytics/CandidateAnalytics";
import VacanciesAnalytics from "../components/analytics/VacanciesAnalytics";
import SystemAnalytics from "../components/analytics/SystemAnalytics";
export default function Analytics() {
  const { user } = useAuth();

  const isDark = document.documentElement.classList.contains("dark");

  const [vacancies, setVacancies] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const unsubVacancies = onSnapshot(collection(db, "vacancies"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVacancies(data);
    });

    const unsubCandidates = onSnapshot(collection(db, "candidates"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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

  return (
    <div className="p-6 lg:p-10 space-y-10">
      <VacanciesAnalytics vacancies={myVacancies} isDark={isDark} />

      <CandidatesAnalytics
        candidates={myCandidates}
        vacancies={myVacancies}
        isDark={isDark}
      />
      <SystemAnalytics
        candidates={myCandidates}
        vacancies={myVacancies}
        isDark={isDark}
      />
    </div>
  );
}
