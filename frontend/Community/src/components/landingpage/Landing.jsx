import React, { useEffect } from 'react';
import { Code2, BrainCog, Terminal, Network } from 'lucide-react';

import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white hover:bg-white/20 transition-colors duration-200">
      <div className="mb-4 text-blue-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function Landing() {
  const isLoggedIn = useSelector((state)=>state.auth)
  return (
    <div className="h-fit relative flex flex-col items-center justify-between">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          // backgroundImage: 'url("https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <header className="pt-16 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            CodeCraft Community
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto text-center leading-relaxed">
  Join a thriving community of developers passionate about{" "}
  <span className="text-yellow-400 font-semibold inline-block animate-fadeIn1">Web Development</span>,{" "}
  <span className="text-orange-400 font-semibold inline-block animate-fadeIn2">DSA</span>,{" "}
  <span className="text-rose-400 font-semibold inline-block animate-fadeIn3">AI/ML</span>, and{" "}
  <span className="text-red-400 font-semibold inline-block animate-fadeIn4">Competitive Programming</span>.
</p>




        </header>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Code2 className="w-8 h-8" />}
            title="Web Development"
            description="Master modern web technologies and frameworks"
          />
          <FeatureCard 
            icon={<Terminal className="w-8 h-8" />}
            title="DSA"
            description="Excel in Data Structures and Algorithms"
          />
          <FeatureCard 
            icon={<BrainCog className="w-8 h-8" />}
            title="AI/ML"
            description="Explore the world of Artificial Intelligence"
          />
          <FeatureCard 
            icon={<Network className="w-8 h-8" />}
            title="CP"
            description="Enhance your Competitive Programming skills"
          />
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="relative z-10 w-full pb-40 px-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <NavLink
          to={isLoggedIn?'/home':'/login'}
          >
          <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 min-w-[160px]">
            Log In
          </button>
          </NavLink>
          <NavLink
          // to="/signup"
          to={isLoggedIn?'/home':'/signup'}
          >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 min-w-[160px]">
            Sign Up
          </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Landing;