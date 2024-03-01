import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth.js'
import {login, logout} from './store/feature/authSlice'
import './App.css'
import {Header, Footer} from './components/index.js'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(false)
  const dispatch =  useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])

  

  return loading ? <h1>Loading...</h1> : (
    <div className=' min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
          <main>
           {/* <Outlet/> */}
          </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
