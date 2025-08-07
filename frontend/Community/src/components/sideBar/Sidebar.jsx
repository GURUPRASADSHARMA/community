import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, User, Users, Info ,Search,Hourglass} from 'lucide-react';
import { useSelector } from 'react-redux';
function Sidebar() {


  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth)
  const profilePicture = user?.profileImage
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static
        top-0 left-0 h-fit
        w-[280px] lg:w-64
        bg-gray-300
        p-5 rounded-r-xl lg:rounded-xl
        m-1 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-40 lg:z-auto
        shadow-lg
      `}>
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-2 border-gray-400 overflow-hidden mb-4 shadow-md">
            {profilePicture ? <img
              src={user?.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            /> : <img
              src="https://cdn.pixabay.com/photo/2024/02/29/19/58/winter-8605108_1280.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />}
            <img
              src={user?.profileImage || "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftheauthorhelper.com%2Funderstanding-pixels%2F&psig=AOvVaw1wjYlMpeInmqWLtDOHcWxs&ust=1753751978994000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKjkgbGx3o4DFQAAAAAdAAAAABAE"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>

              <Link to="/home">
                <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                  <Home size={20} />
                  <span>Home</span>
                </div>
              </Link>
              {/* (
                <Link to="/signup">
                  <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                    <Home size={20} />
                    <span>Home</span>
                  </div>
                </Link>
              )} */}
            </li>
            <li>
              <Link
                to={isLoggedIn ? "/friend" : ""}
              >
                <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                  <User size={20} />
                  <span>Friends</span>
                </div>
              </Link>
            </li>
            <li>
              <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                <Users size={20} />
                <span>Community</span>
              </div>
            </li>
            <li>
              <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                <Info size={20} />
                <span>About</span>
              </div>
            </li>
            <li>
              
              <Link to={isLoggedIn ? "/search-friends" : ""}>
                <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                  <Search size={20} />
                  <span>Search Friends</span>
                </div>
              </Link>
            </li>
            {/* <li>
              
              <Link to={isLoggedIn ? "/pending-requests" : ""}>
                <div className="p-3 pl-4 text-zinc-500 hover:bg-zinc-700 hover:text-white rounded cursor-pointer transition-colors duration-200 flex items-center gap-3">
                  <Hourglass size={20} />
                  <span>Pending Requests</span>
                </div>
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
}

export default Sidebar;