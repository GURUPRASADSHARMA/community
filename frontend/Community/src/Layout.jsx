// import React from 'react'
import Header from './components/header/header'
// import Landing from './components/landingpage/Landing';
import Sidebar from './components/sideBar/Sidebar'

import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Sidebar from './Sidebar';

import { useEffect } from 'react';
import { connectSocket } from './utils/socket/socket';


function Layout() {



useEffect(()=>{
    const socket = connectSocket()
    socket.on("connect",()=>{
      console.log(`${socket.id} is connected`)
    })
    
    socket.on("disconnect", (reason) => {
  console.log(`❌ Disconnected. Reason: ${reason}`);
});
  
},[])
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <Header />
      </header>
      <div className="flex flex-1 bg-zinc-500">
        <Sidebar />
        <main className="flex-1 p-1">
          <div className="border-2 border-black rounded-xl bg-gray-300 h-fit min-h-[724px] overflow-auto ">
            {/* <Landing/> */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
