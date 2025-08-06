import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart, MessageCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { likePost } from '../store/postSlice';
import CommentSection from './CommentSection';

const PhotoPost = ({ post }) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLikeClick = () => {
    if (!isLiked) {
      dispatch(likePost(post.id));
      setIsLiked(true);
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 800);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:shadow-md">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-800 text-sm">
          User • <span className="text-gray-500">{formatDate(post.timestamp)}</span>
        </h3>
      </div>

      <div className="relative">
        <img 
          src={post.imageUrl} 
          alt="Posted photo" 
          className="w-full h-auto object-cover aspect-[4/3]"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button 
            onClick={handleLikeClick}
            className={`flex items-center gap-1 ${isLiked ? 'text-pink-500' : 'text-gray-700'}`}
            aria-label={isLiked ? "Liked" : "Like"}
          >
            <Heart 
              size={22} 
              className={`transition-transform ${isLikeAnimating ? 'scale-150' : 'scale-100'} ${isLiked ? 'fill-pink-500' : ''}`} 
            />
            <span className="text-sm">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-700"
            aria-label={showComments ? "Hide comments" : "Show comments"}
          >
            <MessageCircle size={22} />
            <span className="text-sm">{post.comments.length}</span>
          </button>
        </div>

        <p className="text-gray-800 mb-3">{post.description}</p>
        
        {showComments && <CommentSection post={post} />}
      </div>
    </article>
  );
};

PhotoPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired
    })).isRequired,
    timestamp: PropTypes.string.isRequired
  }).isRequired
};

export default PhotoPost;