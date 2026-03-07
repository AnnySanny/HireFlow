import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import CandidateCard from "./CandidateCard";

export default function CandidatesList({ search, status, vacancy }) {

  const { user } = useAuth();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "candidates"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCandidates(data);
      setLoading(false);

    });

    return () => unsubscribe();

  }, [user]);

  if (loading) {
    return (
      <div className="text-center text-slate-500">
        Завантаження кандидатів...
      </div>
    );
  }

  const filteredCandidates = candidates.filter((c) => {

    const matchesStatus =
      status === "all" || c.status === status;

    const matchesVacancy =
      vacancy === "all" ||
      (vacancy === "none" && !c.vacancyId) ||
      c.vacancyId === vacancy;

    const matchesSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());

    return (
      matchesStatus &&
      matchesVacancy &&
      matchesSearch
    );

  });

  if (!filteredCandidates.length) {
    return (
      <div className="text-center text-slate-500">
        Кандидатів не знайдено
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {filteredCandidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
        />
      ))}

    </div>
  );
}