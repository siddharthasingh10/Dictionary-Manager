

import { useState } from 'react';
import { userAuthStore } from '../store/userAuthStore';

const AddFriend = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const addFriend = userAuthStore((state) => state.addFriend);

  const handleAddFriend = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      setMessage(null);
      
      await addFriend(email);
      setMessage({
        type: 'success',
        text: 'Friend added successfully!'
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to add friend'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-base-200 w-full max-w-xl mx-auto my-8">
      <h2 className="text-xl font-semibold mb-4 text-base-content">Add New Friend</h2>
      
      <div className="flex w-full gap-2">
        <input
          type="email"
          placeholder="Enter friend's email address"
          className="input input-bordered input-lg flex-grow focus:ring-2 focus:ring-primary focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
        />
        
        <button
          className={`btn btn-primary btn-lg transition-all duration-200 hover:bg-primary-focus hover:scale-[1.02] active:scale-95 ${
            loading ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={handleAddFriend}
          disabled={loading || !email}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <span className="flex items-center gap-2">
              Add
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </button>
      </div>
      
      {/* {message && (
        <div className={`mt-4 p-3 rounded-lg w-full text-center ${
          message.type === 'success' 
            ? 'bg-success/20 text-success' 
            : 'bg-error/20 text-error'
        }`}>
          {message.text}
        </div>
      )} */}
    </div>
  );
};

export default AddFriend;