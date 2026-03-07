import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signOut
} from "firebase/auth";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Settings() {

  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {

    const loadUserData = async () => {

      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();
        setName(data.name || "");
        setEmail(data.email || "");

      }

    };

    loadUserData();

  }, [user]);

  const toast = (icon, title) => {

    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2500
    });

  };

  const handleSaveProfile = async () => {

    try {

      const ref = doc(db, "users", user.uid);

      await updateDoc(ref, {
        name
      });

      toast("success", "Профіль оновлено");

    } catch {

      toast("error", "Помилка оновлення");

    }

  };

  const handleChangePassword = async () => {

    try {

      if (!currentPassword || !newPassword) {
        toast("warning", "Заповніть всі поля");
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");

      toast("success", "Пароль змінено");

    } catch {

      toast("error", "Невірний поточний пароль");

    }

  };

  const handleDeleteAccount = async () => {

    const result = await Swal.fire({
      title: "Видалити профіль?",
      text: "Всі дані користувача буде безповоротно видалено.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Видалити",
      cancelButtonText: "Скасувати",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#2b7efe"
    });

    if (!result.isConfirmed) return;

    try {

      await deleteDoc(doc(db, "users", user.uid));

      await deleteUser(user);
        
      await signOut(auth);

        navigate("/");

      Swal.fire({
        icon: "success",
        title: "Профіль видалено",
        timer: 2000,
        showConfirmButton: false
      });

    } catch {

      toast("error", "Помилка видалення профілю");

    }

  };

  return (

    <div className="flex justify-center px-4 py-10">

      <div className="w-full max-w-4xl">



        <div className="grid md:grid-cols-2 gap-10">


 <div>

  <div className="flex items-center gap-4 mb-6">
    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
    <span className="text-sm text-slate-500 dark:text-slate-400">
      Профіль
    </span>
    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
  </div>

  <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col gap-4">

    <label className="text-sm text-blue-500 font-medium">
      Прізвище та ім’я
    </label>

    <input
      type="text"
      className="
      border border-slate-200 dark:border-slate-700
      rounded-lg px-4 py-2
      bg-white dark:bg-slate-800
      text-slate-700 dark:text-slate-200
      focus:outline-none focus:ring-2 focus:ring-blue-500/40
      transition
      "
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <label className="text-sm text-blue-500 font-medium">
      Електронна пошта
    </label>

    <input
      type="email"
      className="
      border border-slate-200 dark:border-slate-700
      rounded-lg px-4 py-2
      bg-slate-100 dark:bg-slate-800
      text-slate-500 dark:text-slate-400
      cursor-not-allowed
      "
      value={email}
      disabled
    />

    <button
      onClick={handleSaveProfile}
      className="
      mt-2
      bg-blue-500
      hover:bg-blue-600
      text-white
      py-2.5
      rounded-lg
      font-medium
      transition
      shadow-sm
      hover:shadow
      "
    >
      Зберегти
    </button>

  </div>

</div>


         <div>

  <div className="flex items-center gap-4 mb-6">
    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
    <span className="text-sm text-slate-500 dark:text-slate-400">
      Зміна паролю
    </span>
    <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
  </div>

  <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col gap-4">

    <label className="text-sm text-blue-500 font-medium">
      Поточний пароль
    </label>

    <div className="relative">

      <input
        type={showCurrent ? "text" : "password"}
        className="
        border border-slate-200 dark:border-slate-700
        rounded-lg px-4 py-2 w-full
        bg-white dark:bg-slate-800
        text-slate-700 dark:text-slate-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
        transition
        "
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setShowCurrent(!showCurrent)}
        className="
        absolute right-3 top-2.5
        text-blue-500
        hover:text-blue-600
        transition
        "
      >
        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

    </div>

    <label className="text-sm text-blue-500 font-medium">
      Новий пароль
    </label>

    <div className="relative">

      <input
        type={showNew ? "text" : "password"}
        className="
        border border-slate-200 dark:border-slate-700
        rounded-lg px-4 py-2 w-full
        bg-white dark:bg-slate-800
        text-slate-700 dark:text-slate-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
        transition
        "
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        type="button"
        onClick={() => setShowNew(!showNew)}
        className="
        absolute right-3 top-2.5
        text-blue-500
        hover:text-blue-600
        transition
        "
      >
        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

    </div>

    <button
      onClick={handleChangePassword}
      className="
      mt-2
      bg-blue-500
      hover:bg-blue-600
      text-white
      py-2.5
      rounded-lg
      font-medium
      transition
      shadow-sm
      hover:shadow
      "
    >
      Змінити пароль
    </button>

  </div>

</div>

        </div>
        <div className="flex justify-center mt-12">

          <button
            onClick={handleDeleteAccount}
            className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            Видалити профіль
          </button>

        </div>

      </div>

    </div>

  );

}