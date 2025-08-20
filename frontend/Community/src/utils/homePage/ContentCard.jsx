import React from 'react';
import { Heart, MessageCircle, Share2, User } from 'lucide-react';

// interface ContentCardProps {
//   id: number;
//   username: string;
//   userImage?: string;
//   content: string;
//   imageUrl?: string;
//   likes: number;
//   isLiked: boolean;
//   createdAt: string;
//   onLike: (id: number) => void;
// }

export function ContentCard({
  id,
  username,
  userImage,
  content,
  imageUrl,
  likes,
  isLiked,
  createdAt,
  onLike
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
            {userImage ? (
              <img src={userImage} alt={username} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-indigo-50 flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{username}</h3>
            <p className="text-sm text-gray-500">{createdAt}</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{content}</p>
        
        {imageUrl && (
          <div className="relative h-64 -mx-4 mb-4">
            <img
              src={imageUrl}
              alt="Content"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <button
            onClick={() => onLike(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              isLiked
                ? 'text-red-500 bg-red-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likes}</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}