
import React from "react";
import Sidebar from "../components/Sidebar"; 
import { Outlet } from "react-router-dom";



const Mainlayout = () => {
  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Mainlayout;