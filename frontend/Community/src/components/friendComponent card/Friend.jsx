import React from 'react';
import { UserPlus, User } from 'lucide-react';


export function FriendCard({ username, imageUrl, onSendRequest }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${username}'s profile`}
              className="h-full w-full rounded-full object-cover border-2 border-indigo-100"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-indigo-50 flex items-center justify-center">
              <User className="h-8 w-8 text-indigo-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{username}</h3>
          <p className="text-sm text-gray-500">Potential Friend</p>
        </div>

        <button
          onClick={onSendRequest}
          className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Friend</span>
        </button>
      </div>
    </div>
  );
}