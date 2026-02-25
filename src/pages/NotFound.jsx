import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "ua";

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center">

      <h1 className="
        text-[120px] sm:text-[160px] 
        font-extrabold 
        leading-none 
        mb-6
        text-accent
      ">
        404
      </h1>

      <p className="mb-10 text-xl opacity-70">
        {lang === "en"
          ? "Something went wrong"
          : "Щось пішло не так"}
      </p>

      <Link
        to="/dashboard"
        className="
          px-8 py-3
          rounded-full
          bg-accent text-white
          text-lg font-semibold
          hover:opacity-90
          transition
        "
      >
        {lang === "en" ? "Go to Dashboard" : "На головну"}
      </Link>

    </div>
  );
}