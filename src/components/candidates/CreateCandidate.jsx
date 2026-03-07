import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  where,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

export default function CreateCandidate({ onClose, candidate }) {
  const { user } = useAuth();

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

  const initialForm = {
    name: "",
    phone: "",
    email: "",
    photo: "",
    resume: "",
    vacancyId: "",
    vacancyTitle: "",
    status: "waiting", 
    comments: ""
  };

  const [form, setForm] = useState(candidate ? { ...candidate } : initialForm);
  const [vacancies, setVacancies] = useState([]);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const originalVacancyId = useRef(candidate?.vacancyId || "");


  useEffect(() => {
    const fetchVacancies = async () => {
      const q = query(
        collection(db, "vacancies"),
        where("status", "==", "open"),
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setVacancies(data);
    };

    fetchVacancies();
  }, []);

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
    if (!form.name) newErrors.name = "Введіть ім’я";
    if (!form.phone) newErrors.phone = "Введіть телефон";
    if (!form.email) newErrors.email = "Введіть email";
    return newErrors;
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "user_photos");
    formData.append("api_key", "534364312722821");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djlhf64uc/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload error");
    }

    return data.secure_url;
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

    let photoUrl = form.photo;

    if (file) {
      photoUrl = await uploadToCloudinary(file);
    }

    if (!photoUrl) {
      photoUrl = "/user.png";
    }

    const candidateData = {
      ...form,
      photo: photoUrl,
      status: candidate ? form.status : "waiting",
    };

    const newVacancyId = form.vacancyId || "";
    const oldVacancyId = originalVacancyId.current || "";

    if (candidate) {

      await updateDoc(doc(db, "candidates", candidate.id), candidateData);

      if (oldVacancyId !== newVacancyId) {

        if (oldVacancyId) {

          const oldRef = doc(db, "vacancies", oldVacancyId);
          const snap = await getDoc(oldRef);

          if (snap.exists()) {

            const data = snap.data();
            const count = data.candidatesCount || 0;

            await updateDoc(oldRef, {
              candidates: arrayRemove(candidate.id),
              candidatesCount: count > 0 ? count - 1 : 0,
            });

          }
        }

        if (newVacancyId) {

          const newRef = doc(db, "vacancies", newVacancyId);

          await updateDoc(newRef, {
            candidates: arrayUnion(candidate.id),
            candidatesCount: increment(1),
          });

        }

      }

      toast("success", "Кандидата оновлено");
    }

    else {

      const docRef = await addDoc(collection(db, "candidates"), {
        ...candidateData,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      if (newVacancyId) {

        const vacancyRef = doc(db, "vacancies", newVacancyId);

        await updateDoc(vacancyRef, {
          candidates: arrayUnion(docRef.id),
          candidatesCount: increment(1),
        });

      }

      toast("success", "Кандидата створено");
    }

    onClose();

  } catch (error) {
    console.error(error);
    toast("error", "Помилка збереження");
  } finally {
    setLoading(false);
  }
};

  const renderError = (name) =>
    errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>;

  const inputClass =
    "w-full border rounded-lg px-4 py-2 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

  const preview = file
    ? URL.createObjectURL(file)
    : form.photo
      ? form.photo
      : "img/user.png";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">
            <span className="text-blue-500">
              {candidate ? "Редагування кандидата" : "Створення кандидата"}
            </span>
          </h1>

          <button onClick={onClose} className="text-red-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center w-full">
            <div
              onClick={() => fileInputRef.current.click()}
              className="relative cursor-pointer group"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] transition">
                Оберіть фото
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setForm((prev) => ({ ...prev, photo: "" }));
                }}
            />

            <input
            type="text"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            disabled={!!file}
            className="mt-3 max-w-sm w-full border rounded-lg px-4 py-2 dark:bg-slate-800 border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="або вставте URL фото"
            />
          </div>


          <div>
            <label className="text-sm text-blue-500">Ім’я</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Іван Петренко"
            />

            {renderError("name")}
          </div>


          <div>
            <label className="text-sm text-blue-500">Телефон</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+380..."
            />

            {renderError("phone")}
          </div>

   
          <div>
            <label className="text-sm text-blue-500">Електронна пошта</label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="example@gmail.com"
            />

            {renderError("email")}
          </div>

  
          <div>
            <label className="text-sm text-blue-500">Резюме / портфоліо</label>

            <input
              name="resume"
              value={form.resume}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

       
          <div>
            <label className="text-sm text-blue-500">Вакансія</label>

            <select
              name="vacancyId"
              value={form.vacancyId}
              onChange={(e) => {
                const v = vacancies.find((v) => v.id === e.target.value);

                setForm((prev) => ({
                  ...prev,
                  vacancyId: v?.id || "",
                  vacancyTitle: v?.title || "",
                }));
              }}
              className={inputClass}
            >
              <option value="">Без вакансії</option>

              {vacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.company})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-blue-500">Коментарі</label>

            <input
              name="comments"
              value={form.comments}
              onChange={handleChange}
              className={inputClass}
              placeholder="Дуже стриманий, але цікавий кандедат.."
            />
          </div>

     
          <div className="text-sm text-slate-500">
            Статус: <b className="text-sm text-blue-500">Очікує співбесіди</b>
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
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {loading ? "Збереження..." : candidate ? "Оновити" : "Створити"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
