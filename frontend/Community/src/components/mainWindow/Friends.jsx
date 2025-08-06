import React, { useState, useEffect } from 'react';
import { Search, Users, Heart, MessageCircle, UserPlus, Star } from 'lucide-react';

const mockFriends = [
  {
    id: 1,
    username: 'alex_chen',
    name: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    mutualFriends: 12,
    isVerified: true,
    lastSeen: 'now'
  },
  {
    id: 2,
    username: 'sarah_jones',
    name: 'Sarah Jones',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'away',
    mutualFriends: 8,
    isVerified: false,
    lastSeen: '5 min ago'
  },
  {
    id: 3,
    username: 'mike_wilson',
    name: 'Mike Wilson',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'offline',
    mutualFriends: 23,
    isVerified: true,
    lastSeen: '2 hours ago'
  },
  {
    id: 4,
    username: 'emma_davis',
    name: 'Emma Davis',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    mutualFriends: 15,
    isVerified: false,
    lastSeen: 'now'
  },
  {
    id: 5,
    username: 'david_kim',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'away',
    mutualFriends: 7,
    isVerified: true,
    lastSeen: '1 hour ago'
  },
  {
    id: 6,
    username: 'lisa_garcia',
    name: 'Lisa Garcia',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online',
    mutualFriends: 31,
    isVerified: true,
    lastSeen: 'now'
  }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState(mockFriends);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = mockFriends.filter(friend =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (selectedFilter !== 'all') {
        filtered = filtered.filter(friend => friend.status === selectedFilter);
      }

      setFilteredFriends(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const FriendCard = ({ friend, index }) => (
    <div 
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(friend.status)} rounded-full border-2 border-white`}></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {friend.name}
            </h3>
            {friend.isVerified && (
              <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
            )}
          </div>
          <p className="text-gray-500 text-sm">@{friend.username}</p>
          <p className="text-xs text-gray-400 mt-1">{friend.mutualFriends} mutual friends</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">Last seen {friend.lastSeen}</span>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-blue-50 text-blue-600 hover:scale-110 transition-all duration-200">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-green-50 text-green-600 hover:scale-110 transition-all duration-200">
            <UserPlus className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-red-50 text-red-600 hover:scale-110 transition-all duration-200">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Friend Finder
              </h1>
              <p className="text-gray-600">Discover and connect with amazing people</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search friends by username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-3">
            {['all', 'online', 'away', 'offline'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 font-medium">Searching...</span>
          </div>
        ) : filteredFriends.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results (${filteredFriends.length})` : `All Friends (${filteredFriends.length})`}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.map((friend, index) => (
                <FriendCard key={friend.id} friend={friend} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No friends found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters to find the friends you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;