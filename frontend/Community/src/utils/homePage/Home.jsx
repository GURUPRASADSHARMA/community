import React, { useState } from 'react';
import { ContentCard } from './components/ContentCard';
import { UploadForm } from './components/UploadForm';
import { Upload } from 'lucide-react';

// interface Post {
//   id: number;
//   username: string;
//   userImage?: string;
//   content: string;
//   imageUrl?: string;
//   likes: number;
//   isLiked: boolean;
//   createdAt: string;
// }

// Mock data - replace with real data in production
const mockPosts= [
  {
    id: 1,
    username: "Sarah Wilson",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content: "Just finished reading an amazing book about sustainable architecture. The future of our cities looks promising! 🌱🏗️",
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
    likes: 24,
    isLiked: false,
    createdAt: "2 hours ago"
  },
  {
    id: 2,
    username: "Alex Chen",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content: "Exploring new hiking trails this weekend. Nature never ceases to amaze! 🏔️",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
    likes: 45,
    isLiked: true,
    createdAt: "5 hours ago"
  }
];

function App() {
  const [posts, setPosts] = useState(mockPosts);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleUpload = (content, imageUrl) => {
    const newPost = {
      id: Date.now(),
      username: "Current User", // Replace with actual user data
      userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      content,
      imageUrl,
      likes: 0,
      isLiked: false,
      createdAt: "Just now"
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <UploadForm onSubmit={handleUpload} />
        
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Posts Yet</h2>
            <p className="text-gray-600 mb-4">
              Be the first to share your thoughts and ideas with the community!
            </p>
            <button
              onClick={() => document.querySelector('textarea')?.focus()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <ContentCard
                key={post.id}
                {...post}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;