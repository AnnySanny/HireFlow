import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  KanbanSquare,
  BarChart3,
  Pencil,
  CheckCircle
} from "lucide-react";

export default function DashboardGuest() {

  const features = [
    {
      icon: Briefcase,
      title: "Керування вакансіями",
      desc: "Створюйте, редагуйте та керуйте вакансіями. Відстежуйте статуси відкритих та закритих позицій."
    },
    {
      icon: Users,
      title: "База кандидатів",
      desc: "Додавайте кандидатів, переглядайте їх профілі, контакти та історію взаємодії."
    },
    {
      icon: KanbanSquare,
      title: "Kanban дошка",
      desc: "Інтерактивна канбан дошка для відстеження етапів рекрутингу від першої співбесіди до найму."
    },
    {
      icon: Pencil,
      title: "Оновлення статусів",
      desc: "Швидко змінюйте статус кандидата на кожному етапі відбору."
    },
    {
      icon: BarChart3,
      title: "Аналітика",
      desc: "Переглядайте статистику вакансій, кандидатів та активності системи."
    },
    {
      icon: CheckCircle,
      title: "Контроль процесу",
      desc: "Отримуйте повний контроль над процесом рекрутингу в одному зручному інтерфейсі."
    }
  ];

  return (
    <div className="p-6 lg:p-12 space-y-14">
      <div className="text-center max-w-2xl mx-auto space-y-6">

        <h1 className="text-3xl lg:text-4xl font-semibold">
          Ласкаво просимо до Hire<span className="text-blue-500"  style={{ fontFamily: "Orbitron, sans-serif" }}>Flow</span>
        </h1>


        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Увійдіть у систему щоб керувати вакансіями, кандидатами та
          відстежувати аналітику рекрутингу.
        </p>

        <Link
          to="/login"
          className="
          inline-flex items-center justify-center
          px-7 py-3
          rounded-xl
          bg-blue-600
          text-white
          font-medium
          hover:bg-blue-700
          transition
          "
        >
          Увійти в систему
        </Link>

      </div>


      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {features.map((feature, index) => {

          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="
              group
              p-6
              rounded-xl
              border
              border-slate-200
              dark:border-slate-700
              bg-white
              dark:bg-slate-900
              hover:shadow-lg
              transition
              "
            >

              <div
                className="
                w-12 h-12
                flex items-center justify-center
                rounded-lg
                bg-blue-50
                dark:bg-slate-800
                mb-4
                "
              >
                <Icon
                  size={24}
                  className="text-blue-500"
                />
              </div>

              <h3 className="font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}