import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Home() {
  const userLoggedIn = useSelector((state)=>state.auth)
  console.log(userLoggedIn)
  return (
  <>
  <h1>home page</h1>
  <h2>{userLoggedIn.user.username}</h2>
  </>
  )
}

export default Home
