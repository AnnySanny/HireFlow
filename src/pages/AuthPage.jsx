import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { Mars, Venus } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
export default function AuthPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "male",
    birthDate: "",
  });

  const [errors, setErrors] = useState({});

  const isDark = document.documentElement.classList.contains("dark");

  const showToast = (message) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2500,
      background: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#1f2937",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = true;
    }

    if (!form.password) {
      newErrors.password = true;
    } else if (form.password.length < 6) {
      newErrors.password = true;
    }
    
    if (!isLogin) {
      if (!form.name.trim()) {
        newErrors.name = true;
      }
      if (!form.birthDate) {
  newErrors.birthDate = true;
} else {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;

  if (!dateRegex.test(form.birthDate)) {
    newErrors.birthDate = true;
  } else {
    const [day, month, year] = form.birthDate.split(".").map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getDate() !== day
    ) {
      newErrors.birthDate = true;
    }
  }
}
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      showToast(
        lang === "en"
          ? "Please fill in all required fields"
          : "Будь ласка, заповніть всі поля",
      );
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        name: form.name,
        email: form.email,
        gender: form.gender,
        birthDate: form.birthDate,
        createdAt: new Date(),
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: lang === "en" ? "Registration successful" : "Реєстрація успішна",
        showConfirmButton: false,
        timer: 2000,
      });

      setIsLogin(true);
      navigate("/dashboard");
    } catch (error) {

  let message;

  switch (error.code) {

    case "auth/email-already-in-use":
      message = lang === "en"
        ? "This email is already registered"
        : "Ця електронна пошта вже зареєстрована";
      break;

    case "auth/invalid-email":
      message = lang === "en"
        ? "Invalid email format"
        : "Невірний формат електронної пошти";
      break;

    case "auth/weak-password":
      message = lang === "en"
        ? "Password must be at least 6 characters"
        : "Пароль повинен містити мінімум 6 символів";
      break;

    default:
      message = lang === "en"
        ? "Registration error"
        : "Помилка реєстрації";
  }

  showToast(message);
}};
  const handleLogin = async () => {
    if (!validate()) {
      showToast(
        lang === "en"
          ? "Please fill in all required fields correctly"
          : "Будь ласка, заповніть всі поля правильно",
      );
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: lang === "en" ? "Login successful" : "Вхід успішний",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/dashboard");
    } catch (error) {
      showToast(
        lang === "en"
          ? "Invalid email or password"
          : "Невірна пошта або пароль",
      );
    }
  };
  const inputClass = (field) => `
    px-4 py-3 rounded-xl border
    bg-transparent transition
    focus:outline-none
    ${errors[field] ? "border-red-500" : "focus:border-accent"}
  `;
const handleBirthDateChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); 

  if (value.length > 8) {
    value = value.slice(0, 8);
  }

  let formatted = "";

  if (value.length >= 1) {
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-[450px] rounded-3xl p-8 bg-white dark:bg-gray-900 dark:text-white shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin
            ? lang === "en"
              ? "Login"
              : "Вхід"
            : lang === "en"
              ? "Registration"
              : "Реєстрація"}
        </h2>

        <div className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm opacity-70">
                  {lang === "en" ? "Your name" : "Ваше ім'я"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass("name")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-70">
                  {lang === "en" ? "Gender" : "Стать"}
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: "male" })}
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-2 transition ${
                      form.gender === "male"
                        ? "bg-accent text-white"
                        : "border-accent text-accent"
                    }`}
                  >
                    <Mars size={16} />
                    {lang === "en" ? "Male" : "Чоловік"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: "female" })}
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-2 transition ${
                      form.gender === "female"
                        ? "bg-accent text-white"
                        : "border-accent text-accent"
                    }`}
                  >
                    <Venus size={16} />
                    {lang === "en" ? "Female" : "Жінка"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">

                <div className="flex flex-col gap-1">
                  <label className="text-sm opacity-70">
                    {lang === "en"
                      ? "Date of birth (DD.MM.YYYY)"
                      : "Дата народження (ДД.ММ.РРРР)"}
                  </label>

                  <input
                    type="text"
                    placeholder="02.08.2000"
                    value={form.birthDate}
                    maxLength={10}
                    onChange={handleBirthDateChange}
                    className={inputClass("birthDate")}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm opacity-70">
              {lang === "en" ? "Email" : "Електронна пошта"}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass("email")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm opacity-70">
              {lang === "en" ? "Password" : "Пароль"}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass("password")}
            />
          </div>

          <button
            type="button"
            onClick={isLogin ? handleLogin : handleRegister}
            className="mt-2 py-3 rounded-xl bg-accent text-white font-medium hover:opacity-90 transition"
          >
            {isLogin
              ? lang === "en"
                ? "Login"
                : "Увійти"
              : lang === "en"
                ? "Register"
                : "Зареєструватись"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm opacity-80">
          {isLogin ? (
            <>
              {lang === "en" ? "Don't have an account?" : "Немає акаунту?"}{" "}
              <button onClick={() => setIsLogin(false)} className="text-accent">
                {lang === "en" ? "Register" : "Зареєструйтесь"}
              </button>
            </>
          ) : (
            <>
              {lang === "en" ? "Already have an account?" : "Вже маєте акаунт?"}{" "}
              <button onClick={() => setIsLogin(true)} className="text-accent">
                {lang === "en" ? "Login" : "Увійти"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
