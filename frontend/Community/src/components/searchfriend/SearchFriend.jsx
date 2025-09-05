import React, { useEffect, useState } from 'react';
import { Search, User, UserPlus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';




function SearchFriend()  {

const {requestSent} = useSelector((state)=>state.auth.user)
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [hasSearched, setHasSearched] = useState(false);
const [sentRequests, setSentRequests] = useState(new Set());
const requestSentIds = new Set(requestSent.map((user)=>user))
// console.log(requestSent)
// console.log(searchResults)
useEffect(()=>{
  setSentRequests(requestSentIds)
 },[])
 // console.log(searchQuery)
 const handleSearch = async () => {
   if (!searchQuery.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data =  await axios.post("/api/v1/user/find-user",{username:searchQuery})
      console.log(data)
      
   
        setSearchResults(data.data.data);

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (userId, username) => {
    try {
      // TODO: Replace with actual friend request logic
      // const { error } = await supabase
      //   .from('friend_requests')
      //   .insert([
      //     { sender_id: currentUserId, receiver_id: userId, status: 'pending' }
      //   ]);
      
      // setSentRequests(prev => new Set([...prev, userId]));
      const res = await axios.post("/api/v1/user/send-request",{
        receiverId:userId
      })
      // Show success feedback
      console.log(res.data)
      console.log(`Friend request sent to ${username}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Find Friends
          </h1>
          <p className="text-gray-600">Search for friends by username and connect with them</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter username to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
                </h2>
                {searchResults.map((friend, index) => (
                  <div
                    key={friend._id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={friend.profileImage}
                          alt={friend.username}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {friend.username}
                          </h3>
                          {friend.fullname && (
                            <p className="text-gray-600">{friend.fullname}</p>
                          )}
                          <p className="text-sm text-gray-400">
                            Joined {new Date(friend.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleSendRequest(friend._id, friend.username)}
                        disabled={sentRequests.has(friend._id)?true:false}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                          sentRequests.has(friend._id)
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                        }`}
                      >
                        <UserPlus className="w-5 h-5" />
                        <span>
                          {sentRequests.has(friend._id) ? 'Request Sent' : 'Send Request'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </> 
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  No users found with username "{searchQuery}". Try a different search term.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to find friends?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a username in the search bar above to find and connect with new friends.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriend;


