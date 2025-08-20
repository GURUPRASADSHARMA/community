import React from 'react';
import { Camera } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadModalOpen } from '../store/postSlice';
import UploadModal from './UploadModal';

const Header = () => {
  const dispatch = useDispatch();
  const isUploadModalOpen = useSelector(state => state.posts.isUploadModalOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-3xl">
        <h1 className="text-2xl font-bold text-indigo-600">PhotoShare</h1>
        <button
          onClick={() => dispatch(setUploadModalOpen(true))}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          aria-label="Upload photo"
        >
          <Camera size={18} />
          <span className="hidden sm:inline">Upload</span>
        </button>
        {isUploadModalOpen && <UploadModal />}
      </div>
    </header>
  );
};

export default Header;