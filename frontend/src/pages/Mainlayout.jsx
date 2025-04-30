// // components/Layout.jsx
import React from "react";
import Sidebar from "../components/Sidebar"; 
import { Outlet } from "react-router-dom";

// const Mainlayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-base-100">
//       <Sidebar />
//       <main className="flex-1 md:ml-64 p-6 pt-0 mb-16 md:mb-0">
//         <Outlet />
//       </main>
//     </div>
//   );
// };



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