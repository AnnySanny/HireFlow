import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  return (
   <div
  className="
    flex min-h-screen
    bg-slate-100 dark:bg-[#0b1220]
    text-slate-800 dark:text-slate-100
    transition-colors duration-300
  "
>
        <div className="hidden lg:block">
    <Sidebar />
  </div>

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}