import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Send } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addComment } from '../store/postSlice';

const CommentSection = ({ post }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({
        postId: post.id,
        comment: {
          id: Date.now().toString(),
          text: comment,
          timestamp: new Date().toISOString()
        }
      }));
      setComment('');
    }
  };

  return (
    <div className="mt-2 pt-3 border-t border-gray-100">
      {post.comments.length > 0 && (
        <div className="mb-3 max-h-48 overflow-y-auto">
          {post.comments.map(comment => (
            <div key={comment.id} className="mb-2 text-sm">
              <span className="font-medium text-gray-900">User </span>
              <span className="text-gray-800">{comment.text}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send comment"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

CommentSection.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
};

export default CommentSection;