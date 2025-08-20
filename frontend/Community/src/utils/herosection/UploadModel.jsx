import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUploadModalOpen, addPost } from '../store/postSlice';

const UploadModal = () => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    dispatch(setUploadModalOpen(false));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (preview && description.trim()) {
      dispatch(addPost({
        id: Date.now().toString(),
        imageUrl: preview,
        description,
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString(),
      }));
      dispatch(setUploadModalOpen(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Upload Photo</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div 
            className={`mb-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-64 
              ${preview ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-50'} 
              cursor-pointer hover:bg-gray-100 transition-colors`}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="h-full w-full relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-full w-full object-contain" 
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to select a photo</p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Write a description for your photo..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!preview || !description.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Upload size={16} />
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;