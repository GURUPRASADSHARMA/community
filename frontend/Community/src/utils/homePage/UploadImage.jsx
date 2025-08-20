import React, { useState, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

// interface UploadFormProps {
//   onSubmit: (content: string, imageUrl?: string) => void;
// }

export function UploadForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content, imageUrl);
      setContent('');
      setImageUrl('');
      setIsExpanded(false);
    }
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={isExpanded ? 4 : 2}
          />
          
          {isExpanded && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3">
                <ImageIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Add image URL..."
                  className="flex-1 focus:outline-none"
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}