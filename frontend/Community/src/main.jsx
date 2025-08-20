import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes} from "react-router-dom"
import Layout from './Layout.jsx'
import Login from './components/mainWindow/Login.jsx'
import Home from './components/mainWindow/Home.jsx'
import Registration from './components/mainWindow/Registration.jsx'
import Landing from './components/landingpage/Landing.jsx'
import PrivateRoute from './components/private route/PrivateRoute.jsx'
import {Provider, useDispatch, useSelector} from 'react-redux';
import { store } from './components/storeslice/store/Store.js'
import Friends from './components/mainWindow/Friends.jsx'
import { useEffect } from 'react'
import { checkAuth } from './components/storeslice/features/AuthSlice.js'
import SearchFriend from './components/searchfriend/SearchFriend.jsx'
import EmailVerification from './components/verifyEmail/VerifyEmail.jsx'
import { CookiesProvider } from 'react-cookie'



const Main=()=>{
const dispatch = useDispatch()
    useEffect(()=>{
      dispatch(checkAuth())
    },[dispatch])
const {isLoggedIn} = useSelector((state)=>state.auth)
  const router = createBrowserRouter(
    createRoutesFromElements(
      < Route path="" element={<Layout />}>
<Route path='verifyemail' element={<EmailVerification/>}/>
      <Route path='' element={<Landing/>}/>
          <Route path='signup' element={<Registration/>}/>
          <Route path='login' element={ <Login/>}/>
          <Route path='home' element={ PrivateRoute(Home,isLoggedIn)}/>
          <Route path='friend' element={ PrivateRoute(Friends,isLoggedIn)}/>
          <Route path='search-friends' element={ PrivateRoute(SearchFriend,isLoggedIn)}/>
     </Route>
    )
  )

 return <RouterProvider router={router} />
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <CookiesProvider>
    <Main/>
      </CookiesProvider>
    </Provider>
    {/* <App /> */}
  </StrictMode>,
)
