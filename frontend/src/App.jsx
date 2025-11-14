

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
import Social from "./components/Social";
import VocabularyTable from "./components/VocabularyTable";
import DictionaryOverview from "./components/DictionaryOverview";
import Collab from "./components/Collab";
import Savedworkspace from "./components/Savedworkspace";
import ProfilePage from "./components/ProfilePage";
import AddFriend from "./components/AddFriend";

const App = () => {
  const { authUser, isCheckingAuth, } = userAuthStore();
  
  useEffect(() => {
    userAuthStore.getState().initialize();
  }, []);


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
            <Route path="/" element={<Social />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/social" element={<Social />} />
            <Route path="/dictionary/:id" element={<DictionaryOverview />} />
            <Route path="/collaboration" element={<Collab/>} />
            <Route path="/saved" element={<Savedworkspace/>} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/friend" element={<AddFriend />} />
          </Route>
        )}

       
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
