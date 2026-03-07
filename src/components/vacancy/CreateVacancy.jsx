import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
export default function CreateVacancy({ onClose, vacancy }) {
  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2500,
    });
  };
  const initialForm = {
    title: "",
    company: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    experience: "No experience",
    description: "",
    requirements: "",
    deadline: "",
    status: "open",
  };
  const { user } = useAuth();
 const [form, setForm] = useState(
  vacancy
    ? {
        title: vacancy.title || "",
        company: vacancy.company || "",
        department: vacancy.department || "",
        location: vacancy.location || "",
        type: vacancy.type || "Full-time",
        salary: vacancy.salary || "",
        experience: vacancy.experience || "No experience",
        description: vacancy.description || "",
        requirements: vacancy.requirements || "",
        deadline: vacancy.deadline || "",
        status: vacancy.status || "open",
      }
    : initialForm
);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

 const validate = () => {
  const newErrors = {};

  const fields = [
    "title",
    "company",
    "department",
    "location",
    "type",
    "salary",
    "experience",
    "description",
    "requirements",
    "deadline"
  ];

  fields.forEach((key) => {
    if (!form[key]) {
      newErrors[key] = "Поле обов'язкове";
    }
  });

  if (Number(form.salary) <= 0) {
    newErrors.salary = "Зарплата має бути більше 0";
  }

  if (form.deadline && form.deadline < today) {
    newErrors.deadline = "Дата не може бути в минулому";
  }

  return newErrors;
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    setLoading(true);

    if (vacancy) {

      await updateDoc(doc(db, "vacancies", vacancy.id), {
        ...form,
        salary: Number(form.salary),
      });

      toast("success", "Вакансію оновлено");

    } else {

      await addDoc(collection(db, "vacancies"), {
        ...form,
        salary: Number(form.salary),
        candidatesCount: 0,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      toast("success", "Вакансію створено");

    }

    onClose();

  } catch (error) {

    toast("error", vacancy ? "Помилка оновлення вакансії" : "Помилка створення вакансії");

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  const inputClass =
    "w-full border rounded-lg px-4 py-2 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            <span className="text-blue-500">{vacancy ? "Редагування вакансії" : "Створення вакансії"} </span>
          </h1>

          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Назва вакансії
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Frontend Developer"
            />

            {renderError("title")}
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Дедлайн вакансії
            </label>

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              min={today}
              onChange={handleChange}
              className={inputClass}
            />

            {renderError("deadline")}
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Компанія
            </label>

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className={inputClass}
              placeholder="HireFlow Inc."
            />

            {renderError("company")}
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">Відділ</label>

            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              className={inputClass}
              placeholder="Інженерія програмного збезпечення"
            />

            {renderError("department")}
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">Локація</label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="Віддалено / Київ"
            />

            {renderError("location")}
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Тип зайнятості
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Зарплата
            </label>

            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              className={inputClass}
              placeholder="1500"
            />

            {renderError("salary")}
          </div>


          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Досвід роботи
            </label>

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="No experience">Без досвіду</option>
              <option value="1+ years">1+ рік</option>
              <option value="2+ years">2+ роки</option>
              <option value="3+ years">3+ роки</option>
              <option value="5+ years">5+ років</option>
              <option value="7+ years">7+ років</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Опис вакансії
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className={inputClass}
              placeholder="Короткий опис вакансії..."
            />

            {renderError("description")}
          </div>

          <div>
            <label className="text-sm text-slate-500 mb-1 block">
              Основні вимоги
            </label>

            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows="3"
              className={inputClass}
              placeholder="React, JS, REST API..."
            />

            {renderError("requirements")}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Збереження..." : vacancy ? "Оновити" : "Створити"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
