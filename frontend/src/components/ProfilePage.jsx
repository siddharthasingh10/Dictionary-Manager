

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { userAuthStore } from '../store/userAuthStore'  
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
    const navigate = useNavigate()

  const currentUser = userAuthStore((state) => state.authUser._id)
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
          axios.get(`http://localhost:2121/user/get/${userId}`, { 
            withCredentials: true 
          }),
          axios.get(`http://localhost:2121/user/get-friends/${userId}`, { 
            withCredentials: true 
          }),
          axios.get(`http://localhost:2121/workspace/all/${userId}`, { 
            withCredentials: true 
          })
        ])
        
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
const viewHandler = (workspaceId) => {
    try {
        navigate(`/dictionary/${workspaceId}`)
        
    } catch (e) {
        console.error("Error in viewHandler");
    }
}
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 rounded-lg bg-error text-error-content">
          User not found
        </div>
      </div>
    )
  }

  const isCurrentUser = currentUser === user._id

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-base-200 rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-primary to-secondary relative">
          {isCurrentUser && (
            <button className="absolute top-4 right-4 btn btn-sm btn-outline btn-neutral">
              Edit Cover
            </button>
          )}
        </div>
        
        <div className="px-6 pb-6 relative">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6 border-4 border-base-100 rounded-full overflow-hidden">
            <img 
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=128`}
              alt={user.fullName}
              className="w-32 h-32 object-cover"
            />
          </div>
          
          {/* Profile Info */}
          <div className="ml-40 mt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-base-content">{user.fullName}</h1>
                <p className="text-base-content/75">{user.email}</p>
                {user.bio && (
                  <p className="mt-2 text-base-content/90">{user.bio}</p>
                )}
              </div>
              
              {isCurrentUser && (
                <button className="btn btn-primary mt-4 md:mt-0">
                  Edit Profile
                </button>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="stat bg-base-100 rounded-lg p-4 min-w-[120px]">
                <div className="stat-title text-base-content/75">Workspaces</div>
                <div className="stat-value text-primary">{workspaces.length}</div>
              </div>
              
              <div className="stat bg-base-100 rounded-lg p-4 min-w-[120px]">
                <div className="stat-title text-base-content/75">Friends</div>
                <div className="stat-value text-secondary">{friends.length}</div>
              </div>
              
              {isCurrentUser && (
                <div className="stat bg-base-100 rounded-lg p-4 min-w-[120px]">
                  <div className="stat-title text-base-content/75">Saved</div>
                  <div className="stat-value text-accent">{user.savedWorkspaces?.length || 0}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Friends List Section */}
      <div className="bg-base-100 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-base-content">Friends</h2>
          {isCurrentUser && (
            <button className="btn btn-sm btn-outline btn-neutral">Manage Friends</button>
          )}
        </div>
        
        {friends.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {friends.map(friend => (
              <Link 
                to={`/profile/${friend._id}`} 
                key={friend._id}
                className="no-underline hover:scale-105 transition-transform"
              >
                <div className="bg-base-200 rounded-lg p-4 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary">
                    <img 
                      src={friend.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName)}&background=random&size=80`}
                      alt={friend.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold truncate text-base-content">{friend.fullName}</h3>
                  <p className="text-sm text-base-content/70 truncate">{friend.email}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-base-content">
              {isCurrentUser ? "You don't have any friends yet" : "This user has no friends yet"}
            </h3>
            <p className="text-base-content/70 mt-2">
              {isCurrentUser ? "Start connecting with others to see them here!" : "Check back later to see their connections."}
            </p>
            {isCurrentUser && (
              <button className="btn btn-primary mt-4">Find Friends</button>
            )}
          </div>
        )}
      </div>

      {/* Workspaces Section */}
      {workspaces.length > 0 && (
        <div className="bg-base-100 rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-base-content">Workspaces ({workspaces.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map(workspace => (
              <div key={workspace._id} className="bg-base-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2 text-base-content">{workspace.title}</h3>
                <p className="text-base-content/70 mb-4 line-clamp-2">{workspace.description || "No description provided"}</p>
                <div className="flex justify-between items-center">
                  {/* <span className="badge badge-outline">{workspace.type || "General"}</span> */}
                  <button className="btn btn-sm btn-primary" onClick={()=>viewHandler(workspace._id)}>View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage