import { useState, useEffect } from 'react';
import { userAuthStore } from '../store/userAuthStore';
import { FiUserPlus, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddFriend = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [friends, setFriends] = useState([]);

  const { authUser, addFriend } = userAuthStore();

  // ✅ Fetch all friends of the current user
  const fetchFriends = async () => {
    try {
      if (!authUser?._id) return;
      const res = await axios.get(
        `http://localhost:2121/user/get-friends/${authUser._id}`,
        { withCredentials: true }
      );
      setFriends(Array.isArray(res.data.friends) ? res.data.friends : []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [authUser]);

  // ✅ Add Friend handler
  const handleAddFriend = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);
      setMessage(null);

      const res = await addFriend(email);
      setMessage({
        type: 'success',
        text: res?.message || '🎉 Friend added successfully!',
      });

      setEmail('');
      fetchFriends(); // refresh list after adding
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        '❌ Failed to add friend. Try again.';
      setMessage({
        type: 'error',
        text: backendMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-base-100 rounded-2xl shadow-lg border border-base-300 w-full max-w-4xl mx-auto my-12 p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <FiUserPlus className="text-primary text-2xl" />
        <h2 className="text-2xl font-semibold text-base-content">
          Add a New Friend
        </h2>
      </div>

      {/* Input + Button */}
      <div className="flex w-full gap-3">
        <input
          type="email"
          placeholder="Enter friend's email"
          className="input input-bordered w-full rounded-xl text-base focus:ring-2 focus:ring-primary focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
        />

        <button
          onClick={handleAddFriend}
          disabled={loading || !email.trim()}
          className={`btn btn-primary flex items-center gap-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              Add <FiUserPlus />
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-5 flex items-center gap-2 p-3 rounded-xl w-full text-center text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-600 border border-green-300'
              : 'bg-red-100 text-red-600 border border-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <FiCheckCircle className="text-lg" />
          ) : (
            <FiXCircle className="text-lg" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Friends List Section */}
      <div className="w-full mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-base-content">Your Friends</h2>
        </div>

        {friends.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {friends.map((friend) => (
              <Link
                to={`/profile/${friend._id}`}
                key={friend._id}
                className="no-underline hover:scale-105 transition-transform"
              >
                <div className="bg-base-200 rounded-lg p-4 text-center border hover:border-primary/30 transition-all">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/30">
                    <img
                      src={
                        friend.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          friend.fullName
                        )}&background=random&size=80`
                      }
                      alt={friend.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold truncate text-base-content">
                    {friend.fullName}
                  </h3>
                  <p className="text-sm text-base-content/70 truncate">
                    {friend.email}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-base-content/70">
            You haven’t added any friends yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriend;


