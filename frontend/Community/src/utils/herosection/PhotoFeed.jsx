import React from 'react';
import { useSelector } from 'react-redux';
import PhotoPost from './PhotoPost';
import { ImageOff } from 'lucide-react';

const PhotoFeed = () => {
  const posts = useSelector(state => state.posts.posts);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <ImageOff size={64} className="mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
        <p className="text-center max-w-md">
          Click the upload button to share your first photo
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PhotoPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PhotoFeed;