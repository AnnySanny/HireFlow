import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="
      min-h-screen
      flex flex-col items-center justify-center
      text-center
      px-6
      bg-slate-50 dark:bg-slate-950
      text-slate-800 dark:text-slate-100
    "
    >
      <h1
        className="
        text-[120px]
        font-bold
        text-blue-500
        leading-none
      "
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        404
      </h1>


      <h2 className="text-2xl font-semibold mt-4">
        Сторінку не знайдено
      </h2>

      <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md">
        Сторінка, яку ви намагаєтесь відкрити, не існує або була переміщена.
      </p>


      <Link
        to="/"
        className="
        mt-8
        flex items-center gap-2
        px-6 py-3
        rounded-lg
        bg-blue-500
        text-white
        hover:bg-blue-600
        transition
      "
      >
        На головну
      </Link>
    </div>
  );
}