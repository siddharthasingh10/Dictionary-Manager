// // App.jsx
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Profile from "./components/Profile";
// import Mainlayout from "./components/Mainlayout";     

// const browserRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <Mainlayout />,        
//     children: [
//       {
//         path: "profile",
//         element: <Profile />
//       },
//       {
//         path:"/",
//         element: <Profile />
//       }
//     ]
//   },
//   {
//     path: "login",
//     element: <Login />
//   },
//   {
//     path: "signup",
//     element: <Signup />
//   }
// ]);

// function App() {
//   return (
//     <div>
//       <RouterProvider router={browserRouter} />
//       <Toaster />
//     </div>
//   );
// }

// export default App;



// App.jsx

// import { Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useEffect } from "react";
// import { Loader } from "lucide-react";

// import Mainlayout from "./components/Mainlayout";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Profile from "./components/Profile";

// import { userAuthStore } from "./store/userAuthStore"; 

// const App = () => {
//   const { authUser, checkAuth, isCheckingAuth } = userAuthStore(); 

//   console.log(authUser)


//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   if (isCheckingAuth && !authUser) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );
//   }

//   return (

//     <div >
//       <Mainlayout /> 

//       <Routes>
//         <Route path="/" element={authUser ? <Profile /> : <Navigate to="/login" />} />
//         <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
//         <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
//         <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
//       </Routes>

//       <Toaster />
//     </div>
//   );
// };

// export default App;


import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import Mainlayout from "./pages/Mainlayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./components/Profile";

import { userAuthStore } from "./store/userAuthStore";
import Workspace from "./components/Workspace";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Routes>
       
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />

       
        {authUser && (
          <Route element={<Mainlayout />}>
            <Route path="/" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workspace" element={<Workspace />} />
          </Route>
        )}

       
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
