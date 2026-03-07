import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardGuest from "./DashboardGuest";
import Dashboard from "./Dashboard";

export default function MainPage() {
  const { user } = useAuth();

  if (!user) {
    return <DashboardGuest />;
  }

  return <Dashboard user={user} />;
}


