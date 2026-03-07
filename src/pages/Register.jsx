import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });

      navigate("/");

    } catch (err) {
      setError("Помилка реєстрації. Перевірте дані.");
    }

    setLoading(false);
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">

    <div className="w-full max-w-md p-10 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">

      <h1
        className="text-3xl font-semibold text-center mb-8"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        <span className="text-blue-500">Реєстрація</span>
      </h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-5">



        <label className="text-blue-500 text-sm font-medium">
          Прізвище та ім'я
        </label>

        <div className="
          flex items-center gap-3
          border border-slate-200 dark:border-slate-700
          rounded-lg px-4 py-3
          bg-white dark:bg-slate-800
          focus-within:ring-2 focus-within:ring-blue-500/40
          transition
        ">
          <User size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Прізвище та ім'я"
            className="
              w-full outline-none bg-transparent
              text-slate-700 dark:text-slate-200
              placeholder:text-slate-400
            "
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>



        <label className="text-blue-500 text-sm font-medium">
          Електронна пошта
        </label>

        <div className="
          flex items-center gap-3
          border border-slate-200 dark:border-slate-700
          rounded-lg px-4 py-3
          bg-white dark:bg-slate-800
          focus-within:ring-2 focus-within:ring-blue-500/40
          transition
        ">
          <Mail size={18} className="text-slate-400" />

          <input
            type="email"
            placeholder="Електронна пошта"
            className="
              w-full outline-none bg-transparent
              text-slate-700 dark:text-slate-200
              placeholder:text-slate-400
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>



        <label className="text-blue-500 text-sm font-medium">
          Пароль
        </label>

        <div className="
          flex items-center gap-3
          border border-slate-200 dark:border-slate-700
          rounded-lg px-4 py-3
          bg-white dark:bg-slate-800
          focus-within:ring-2 focus-within:ring-blue-500/40
          transition
        ">
          <Lock size={18} className="text-slate-400" />

          <input
            type="password"
            placeholder="Пароль"
            className="
              w-full outline-none bg-transparent
              text-slate-700 dark:text-slate-200
              placeholder:text-slate-400
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>



        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}


        <button
          type="submit"
          disabled={loading}
          className="
            mt-2
            bg-blue-500 hover:bg-blue-600
            text-white
            py-3
            rounded-lg
            font-medium
            transition
            shadow-sm hover:shadow
            disabled:opacity-60
          "
        >
          {loading ? "Створення..." : "Зареєструватися"}
        </button>

      </form>

    </div>

  </div>
);
}