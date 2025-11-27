import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userAuthStore } from '../store/userAuthStore'
const API = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const navigate = useNavigate()
  const currentUser = userAuthStore((state) => state.authUser?._id)
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [friends, setFriends] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
const [userRes, friendsRes, workspacesRes] = await Promise.all([
  axios.get(`${API}/user/get/${userId}`, { withCredentials: true }),
  axios.get(`${API}/user/get-friends/${userId}`, { withCredentials: true }),
  axios.get(`${API}/workspace/all/${userId}`, { withCredentials: true })
]);


        setUser(userRes.data.user || null)
        setFriends(Array.isArray(friendsRes.data.friends) ? friendsRes.data.friends : [])
        setWorkspaces(Array.isArray(workspacesRes.data.workspaces) ? workspacesRes.data.workspaces : [])
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null)
        setFriends([])
        setWorkspaces([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const viewHandler = (workspaceId) => navigate(`/dictionary/${workspaceId}`)
  const isCurrentUser = currentUser === user?._id

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary w-10 h-10"></span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div className="p-6 bg-base-200 rounded-xl shadow-md text-error font-medium">
          User not found
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* 🧑 Profile Header */}
      <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Profile left section */}
          <div className="flex items-center gap-5">
            <img
              src={
                user.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=128`
              }
              alt={user.fullName}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20"
            />
            <div>
              <h1 className="text-3xl font-bold text-base-content">{user.fullName}</h1>
              <p className="text-base-content/70">{user.email}</p>
              {user.bio && (
                <p className="mt-2 text-base-content/80 text-sm leading-relaxed max-w-md">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Right section */}
          {/* {isCurrentUser && (
            <button className="btn btn-primary btn-sm rounded-xl px-6">Edit Profile</button>
          )} */}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-8 border-t border-base-300 pt-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-base-content/70">Workspaces</p>
            <p className="text-xl font-semibold text-primary">{workspaces.length}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-base-content/70">Friends</p>
            <p className="text-xl font-semibold text-secondary">{friends.length}</p>
          </div>
          {isCurrentUser && (
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-base-content/70">Saved</p>
              <p className="text-xl font-semibold text-accent">{user.savedWorkspaces?.length || 0}</p>
            </div>
          )}
        </div>
      </div>

      {/* 👥 Friends Section */}
      <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-base-content">Friends</h2>
          {isCurrentUser && (
            <button className="btn btn-outline btn-sm rounded-xl">Manage Friends</button>
          )}
        </div>

        {friends.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {friends.map((friend) => (
              <Link
                key={friend._id}
                to={`/profile/${friend._id}`}
                className="group p-4 rounded-xl bg-base-200 hover:bg-base-300 border border-transparent hover:border-primary/30 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      friend.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName)}&background=random&size=96`
                    }
                    alt={friend.fullName}
                    className="w-20 h-20 rounded-full border-2 border-primary/30 object-cover mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-medium text-base-content truncate w-full">
                    {friend.fullName}
                  </h3>
                  <p className="text-xs text-base-content/60 truncate w-full">
                    {friend.email}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-base-content/70 mb-2">
              {isCurrentUser ? "You don't have any friends yet." : "No friends to show."}
            </p>
            {isCurrentUser && (
              <button className="btn btn-primary btn-sm rounded-xl">Find Friends</button>
            )}
          </div>
        )}
      </div>

      {/* 🗂 Workspaces Section */}
      {workspaces.length > 0 && (
        <div className="bg-base-100 rounded-2xl p-8 shadow-sm border border-base-300">
          <h2 className="text-2xl font-semibold mb-6 text-base-content">Workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace._id}
                className="p-5 bg-base-200 rounded-xl border border-base-300 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-base-content mb-2 truncate">
                  {workspace.title}
                </h3>
                <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                  {workspace.description || 'No description provided'}
                </p>
                <button
                  onClick={() => viewHandler(workspace._id)}
                  className="btn btn-sm btn-primary w-full rounded-xl"
                >
                  View Workspace
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage


// import { useEffect, useState } from 'react'
// import { useParams, Link } from 'react-router-dom'
// import axios from 'axios'
// import { userAuthStore } from '../store/userAuthStore'  
// import { useNavigate } from 'react-router-dom'

// const ProfilePage = () => {
//     const navigate = useNavigate()

//   const currentUser = userAuthStore((state) => state.authUser._id)
//   const { userId } = useParams()
//   const [user, setUser] = useState(null)
//   const [friends, setFriends] = useState([])
//   const [workspaces, setWorkspaces] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setIsLoading(true)
        
//         const [userRes, friendsRes, workspacesRes] = await Promise.all([
//           axios.get(`http://localhost:2121/user/get/${userId}`, { 
//             withCredentials: true 
//           }),
//           axios.get(`http://localhost:2121/user/get-friends/${userId}`, { 
//             withCredentials: true 
//           }),
//           axios.get(`http://localhost:2121/workspace/all/${userId}`, { 
//             withCredentials: true 
//           })
//         ])
        
//         setUser(userRes.data.user || null)
//         setFriends(Array.isArray(friendsRes.data.friends) ? friendsRes.data.friends : [])
//         setWorkspaces(Array.isArray(workspacesRes.data.workspaces) ? workspacesRes.data.workspaces : [])
        
//       } catch (error) {
//         console.error('Error fetching user data:', error)
//         setUser(null)
//         setFriends([])
//         setWorkspaces([])
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchUserData()
//   }, [userId])
// const viewHandler = (workspaceId) => {
//     try {
//         navigate(`/dictionary/${workspaceId}`)
        
//     } catch (e) {
//         console.error("Error in viewHandler");
//     }
// }
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="p-4 rounded-lg bg-error text-error-content">
//           User not found
//         </div>
//       </div>
//     )
//   }

//   const isCurrentUser = currentUser === user._id

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       {/* Profile Header */}
//       <div className="bg-base-200 rounded-xl shadow-lg overflow-hidden mb-8">
//         {/* Banner */}
//         <div className="h-48 bg-gradient-to-r from-primary to-secondary relative">
//           {isCurrentUser && (
//             <button className="absolute top-4 right-4 btn btn-sm btn-outline btn-neutral">
//               Edit Cover
//             </button>
//           )}
//         </div>
        
//         <div className="px-6 pb-6 relative">
//           {/* Profile Picture */}
//           <div className="absolute -top-16 left-6 border-4 border-base-100 rounded-full overflow-hidden">
//             <img 
//               src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=128`}
//               alt={user.fullName}
//               className="w-32 h-32 object-cover"
//             />
//           </div>
          
//           {/* Profile Info */}
//           <div className="ml-40 mt-4">
//             <div className="flex flex-col md:flex-row md:items-end justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-base-content">{user.fullName}</h1>
//                 <p className="text-base-content/75">{user.email}</p>
//                 {user.bio && (
//                   <p className="mt-2 text-base-content/90">{user.bio}</p>
//                 )}
//               </div>
              
//               {isCurrentUser && (
//                 <button className="btn btn-primary mt-4 md:mt-0">
//                   Edit Profile
//                 </button>
//               )}
//             </div>
            
//             {/* Stats */}
//             <div className="flex flex-wrap gap-6 mt-6">
//               <div className="stat bg-base-100 rounded-lg p-4 min-w-[120px]">
//                 <div className="stat-title text-base-content/75">Workspaces</div>
//                 <div className="stat-value text-primary">{workspaces.length}</div>
//               </div>
              
//               <div className="stat bg-base-100 rounded-lg p-4 min-w-[120px]">
//                 <div className="stat-title text-base-content/75">Friends</div>
//                 <div className="stat-value text-secondary">{friends.length}</div>
//               </div>
              
//               {isCurrentUser && (
//                 <div className="stat bg-base-100 rounded-lg p-4 min-w-[120px]">
//                   <div className="stat-title text-base-content/75">Saved</div>
//                   <div className="stat-value text-accent">{user.savedWorkspaces?.length || 0}</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Friends List Section */}
//       <div className="bg-base-100 rounded-xl shadow-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-base-content">Friends</h2>
//           {isCurrentUser && (
//             <button className="btn btn-sm btn-outline btn-neutral">Manage Friends</button>
//           )}
//         </div>
        
//         {friends.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {friends.map(friend => (
//               <Link 
//                 to={`/profile/${friend._id}`} 
//                 key={friend._id}
//                 className="no-underline hover:scale-105 transition-transform"
//               >
//                 <div className="bg-base-200 rounded-lg p-4 text-center">
//                   <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary">
//                     <img 
//                       src={friend.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName)}&background=random&size=80`}
//                       alt={friend.fullName}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <h3 className="font-semibold truncate text-base-content">{friend.fullName}</h3>
//                   <p className="text-sm text-base-content/70 truncate">{friend.email}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="text-base-content/50 mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-base-content">
//               {isCurrentUser ? "You don't have any friends yet" : "This user has no friends yet"}
//             </h3>
//             <p className="text-base-content/70 mt-2">
//               {isCurrentUser ? "Start connecting with others to see them here!" : "Check back later to see their connections."}
//             </p>
//             {isCurrentUser && (
//               <button className="btn btn-primary mt-4">Find Friends</button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Workspaces Section */}
//       {workspaces.length > 0 && (
//         <div className="bg-base-100 rounded-xl shadow-lg p-6 mt-8">
//           <h2 className="text-2xl font-bold mb-6 text-base-content">Workspaces ({workspaces.length})</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {workspaces.map(workspace => (
//               <div key={workspace._id} className="bg-base-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                 <h3 className="text-xl font-semibold mb-2 text-base-content">{workspace.title}</h3>
//                 <p className="text-base-content/70 mb-4 line-clamp-2">{workspace.description || "No description provided"}</p>
//                 <div className="flex justify-between items-center">
//                   {/* <span className="badge badge-outline">{workspace.type || "General"}</span> */}
//                   <button className="btn btn-sm btn-primary" onClick={()=>viewHandler(workspace._id)}>View</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ProfilePage