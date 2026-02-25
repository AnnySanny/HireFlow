import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
export default function CheckIn() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
    const { user } = useAuth();

    const formatDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}.${month} ${hours}:${minutes}`;
};
 const moods = [
  { key: "great", bg: "bg-lime-500" },
  { key: "good", bg: "bg-green-500" },
  { key: "excited", bg: "bg-amber-400" },

  { key: "calm", bg: "bg-cyan-500" },
  { key: "surprised", bg: "bg-violet-500" },

  { key: "sad", bg: "bg-blue-600" },
  { key: "anxious", bg: "bg-rose-500" },
  { key: "upset", bg: "bg-indigo-600" },

  { key: "angry", bg: "bg-red-600" },
  { key: "annoyed", bg: "bg-orange-500" },

  { key: "bored", bg: "bg-zinc-500" },
  { key: "sleepy", bg: "bg-slate-500" },
];

  const translations = {
    great: { en: "Great", ua: "Чудово" },
    good: { en: "Good", ua: "Добре" },
    sad: { en: "Sad", ua: "Сумно" },
    upset: { en: "Upset", ua: "Засмучений" },
    angry: { en: "Angry", ua: "Злий" },
    sleepy: { en: "Sleepy", ua: "Сонний" },
    bored: { en: "Bored", ua: "Нудно" },
    annoyed: { en: "Annoyed", ua: "Роздратований" },
    surprised: { en: "Surprised", ua: "Здивований" },
    calm: { en: "Calm", ua: "Спокійний" },
    anxious: { en: "Anxious", ua: "Тривожний" },
    excited: { en: "Excited", ua: "Схвильований" },
  };

  const handleSave = async () => {
  if (!selectedMood) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title:
        lang === "en"
          ? "Please select a mood"
          : "Оберіть настрій",
      showConfirmButton: false,
      timer: 2000,
      background: document.documentElement.classList.contains("dark")
        ? "#0f172a"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#ffffff"
        : "#1f2937",
    });
    return;
  }

  try {
    await addDoc(collection(db, "moods"), {
      userId: user.uid,
      mood: selectedMood,
      note: note || "",
      formattedDate: formatDate(),
      createdAt: serverTimestamp(),
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title:
        lang === "en"
          ? "Mood saved"
          : "Настрій збережено",
      showConfirmButton: false,
      timer: 2000,
      background: document.documentElement.classList.contains("dark")
        ? "#0f172a"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#ffffff"
        : "#1f2937",
    });
    setSelectedMood(null);
    setNote("");

    navigate("/dashboard");

  } catch (error) {
    Swal.fire({
      icon: "error",
      title:
        lang === "en"
          ? "Something went wrong"
          : "Сталася помилка",
    });
  }
};

  return (
    <div className="w-full flex justify-center px-4 py-12">
<div
  className="
    w-full max-w-[900px]
    rounded-[40px]
    border-2 border-[var(--accent)]/15
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100
    p-6 sm:p-10 md:p-14
    shadow-sm dark:shadow-black/30
    transition-colors duration-300
  "
>
  
        <h2 className="text-2xl font-semibold mb-8">
          {lang === "en"
            ? "How are you feeling today?"
            : "Як ви почуваєтесь сьогодні?"}
        </h2>

    
        <div
          className="
          grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6
          gap-6
          mb-10
        "
        >
          {moods.map((mood) => (
            <button
              key={mood.key}
              onClick={() => setSelectedMood(mood.key)}
              className={`
                flex flex-col items-center
                transition-all
                hover:scale-105
                ${
                  selectedMood === mood.key
                    ? "scale-110"
                    : "opacity-80"
                }
              `}
            >
              <img
                src={`/img/${mood.key}.png`}
                alt={mood.key}
                className={`
                  w-14 h-14 sm:w-16 sm:h-16
                  mb-2
                  ${selectedMood === mood.key ? "drop-shadow-xl" : ""}
                `}
              />

       <span
  className={`
    text-sm font-medium
    px-3 py-1 rounded-[12px]
    transition-all
    ${
      selectedMood === mood.key
        ? `${mood.bg} text-white`
        : "opacity-70"
    }
  `}
>
  {translations[mood.key][lang]}
</span>
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            lang === "en"
              ? "What's on your mind?"
              : "Що у вас на думці?"
          }
      className="
  w-full
  h-[120px]
  rounded-2xl
  border-2 border-[var(--accent)]/15
  p-4
  resize-none
  bg-slate-50 dark:bg-slate-900
  text-slate-800 dark:text-slate-100
  focus:outline-none
  focus:ring-2 focus:ring-[var(--accent)]/60
  focus:border-[var(--accent)]/40
  shadow-sm dark:shadow-black/30
  transition-colors duration-300
  mb-8
"
        />

     
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/")}
            className="
              px-6 py-2
              rounded-full
              border
              border-gray-400
              hover:bg-gray-200
              dark:hover:bg-gray-700
              transition
            "
          >
            {lang === "en" ? "Cancel" : "Скасувати"}
          </button>

          <button
            onClick={handleSave}
            className="
              px-8 py-2
              rounded-full
              bg-accent
              text-white
              hover:scale-105
              transition
            "
          >
            {lang === "en" ? "Save" : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
}