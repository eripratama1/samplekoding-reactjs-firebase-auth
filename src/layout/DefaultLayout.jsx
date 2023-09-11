import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, [])


  return loading ? (
    <Loader />
  ) : (
    <>
      <div className='dark:bg-boxdark-2 dark:text-bodydark'>
        <div className='flex h-screen overflow-hidden'>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <main>
              <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default DefaultLayout