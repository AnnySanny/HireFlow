import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import VacancyCard from "./VacancyCard";

export default function VacancyList({ search, status, type, experience }) {

  const { user } = useAuth();

  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "vacancies"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVacancies(data);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  if (loading) {
    return (
      <div className="text-center text-slate-500">
        Завантаження вакансій...
      </div>
    );
  }

  const filteredVacancies = vacancies.filter((v) => {

    const matchesStatus =
      status === "all" || v.status === status;

    const matchesType =
      type === "all" || v.type === type;

    const matchesExperience =
      experience === "all" || v.experience === experience;

    const matchesSearch =
      !search ||
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.company?.toLowerCase().includes(search.toLowerCase()) ||
      v.department?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase()) ||
      String(v.salary).includes(search);

    return (
      matchesStatus &&
      matchesType &&
      matchesExperience &&
      matchesSearch
    );

  });

  if (!filteredVacancies.length) {
    return (
      <div className="text-center text-slate-500">
        Нічого не знайдено
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {filteredVacancies.map((vacancy) => (
        <VacancyCard
          key={vacancy.id}
          vacancy={vacancy}
        />
      ))}

    </div>
  );
}