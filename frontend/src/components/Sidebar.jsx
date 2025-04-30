// Sidebar.jsx
import React from 'react';
import { Users, FolderKanban, Share2, Bookmark } from 'lucide-react';

const sidebarItems = [
  { label: 'Social', icon: Users },
  { label: 'Workspace', icon: FolderKanban },
  { label: 'Collaboration', icon: Share2 },
  { label: 'Saved', icon: Bookmark },
];

const Sidebar = () => {
  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-base-200 border-r shadow-md flex-col p-4 z-40">
        <h1 className="text-xl font-bold mb-6 px-2">MyApp</h1>
        {sidebarItems.map(({ label, icon: Icon }) => (
          <button key={label} className="btn btn-ghost justify-start gap-4 mb-2 text-base w-full">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Bottom nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-base-200 border-t shadow-md flex justify-around items-center py-2 z-50">
        {sidebarItems.map(({ label, icon: Icon }) => (
          <button key={label} className="btn btn-ghost btn-circle">
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
