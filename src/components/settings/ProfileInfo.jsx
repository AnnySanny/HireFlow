import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import { Mars, Venus } from "lucide-react";

export default function ProfileInfo() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    gender: "male",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "male",
      });
    }
  }, [user]);

  const isDark = document.documentElement.classList.contains("dark");

  const showToast = (type, message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1f2937",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = true;

    if (!form.birthDate) {
      newErrors.birthDate = true;
    } else {
      const regex =
        /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
      if (!regex.test(form.birthDate)) {
        newErrors.birthDate = true;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast(
        "error",
        lang === "en"
          ? "Please fill fields correctly"
          : "Будь ласка, заповніть поля правильно"
      );
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: form.name,
        birthDate: form.birthDate,
        gender: form.gender,
      });

      showToast(
        "success",
        lang === "en" ? "Profile updated" : "Профіль оновлено"
      );

      setEditMode(false);
    } catch (err) {
      showToast(
        "error",
        lang === "en" ? "Update failed" : "Помилка оновлення"
      );
    }
  };

  const inputClass = (field) => `
    px-4 py-3 rounded-xl border
    bg-transparent transition
    focus:outline-none focus:border-accent
    ${errors[field] ? "border-red-500" : ""}
  `;

  if (!user) return null;
const handleBirthDateChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); 

  if (value.length > 8) {
    value = value.slice(0, 8);
  }

  let formatted = "";

  if (value.length > 0) {
    formatted += value.slice(0, 2);
  }

  if (value.length >= 3) {
    formatted += "." + value.slice(2, 4);
  }

  if (value.length >= 5) {
    formatted += "." + value.slice(4, 8);
  }

  setForm({ ...form, birthDate: formatted });
};
  return (
    <div className="
      w-full lg:w-[420px]
      rounded-2xl border
      px-8 py-8
      bg-gray-50 dark:bg-gray-800
      transition-theme
    ">

      <h3 className="text-[20px] mb-8 font-semibold">
        {lang === "en"
          ? "Profile Information"
          : "Інформація профілю"}
      </h3>

      <div className="flex flex-col gap-6 text-[15px]">

        <div className="flex flex-col gap-1">
          <label className="text-sm opacity-70">
            {lang === "en" ? "Name" : "Ім'я"}
          </label>

          {editMode ? (
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={inputClass("name")}
            />
          ) : (
            <div className="px-4 py-3 rounded-xl border bg-transparent">
              {user.name}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm opacity-70">Email</label>

          <div className="px-4 py-3 rounded-xl border opacity-60">
            {user.email}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm opacity-70">
            {lang === "en" ? "Birthday" : "Дата народження"}
          </label>

          {editMode ? (
            <input
              type="text"
              placeholder="02.08.2000"
              value={form.birthDate}
              onChange={handleBirthDateChange}
              maxLength={10}
              className={inputClass("birthDate")}
            />
          ) : (
            <div className="px-4 py-3 rounded-xl border bg-transparent">
              {user.birthDate}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm opacity-70">
            {lang === "en" ? "Gender" : "Стать"}
          </label>

          {editMode ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, gender: "male" })
                }
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition ${
                  form.gender === "male"
                    ? "bg-accent text-white"
                    : "border-accent text-accent"
                }`}
              >
                <Mars size={16} />
                {lang === "en" ? "Male" : "Чоловіча"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, gender: "female" })
                }
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition ${
                  form.gender === "female"
                    ? "bg-accent text-white"
                    : "border-accent text-accent"
                }`}
              >
                <Venus size={16} />
                {lang === "en" ? "Female" : "Жіноча"}
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 rounded-xl border bg-transparent">
              {user.gender === "male"
                ? lang === "en"
                  ? "Male"
                  : "Чоловіча"
                : lang === "en"
                ? "Female"
                : "Жіноча"}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="
                  px-8 py-3 rounded-full
                  bg-accent text-white
                  hover:opacity-90 transition
                "
              >
                {lang === "en" ? "Save" : "Зберегти"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="
                  px-8 py-3 rounded-full
                  border border-accent text-accent
                  hover:bg-accent hover:text-white
                  transition
                "
              >
                {lang === "en" ? "Cancel" : "Скасувати"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="
                px-8 py-3 rounded-full
                bg-accent text-white
                hover:opacity-90 transition
              "
            >
              {lang === "en"
                ? "Edit profile"
                : "Редагувати профіль"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}