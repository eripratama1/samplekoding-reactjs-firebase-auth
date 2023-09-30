import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { Navigate, Outlet } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../hooks/firebase'

const DefaultLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dataUser, setDataUser] = useState([])

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, [])


  // Ketika kode useEffect ini dimuat, akan menjalankan fungsi fetchUser, yang akan mengambil data pengguna dari Firestore dan 
  // mengisi state dataUser dengan data yang diddapt dari firestore.
  useEffect(() => {
    async function fetchUser() {
      // kode ini digunakan untuk mendapatkan userId dari penyimpanan localStorage. userId digunakan untuk mengidentifikasi pengguna 
      // yang sedang login.
      const userId = localStorage.getItem('LOGGED_IN')

      // membuat referensi koleksi Firestore dengan menggunakan fungsi query.
      // mencari dokumen di koleksi "users" di mana properti "userId" sama dengan nilai userId yang kita dapatkan sebelumnya dari 
      // localStorage
      const colRef = query(collection(db, "users"), where("userId", "==", userId))
      const querySnapshot = await getDocs(colRef)

      // Di sini, kita mengambil data dari setiap dokumen yang ditemukan dalam querySnapshot dan mengubahnya menjadi 
      //array objek. Setiap objek dalam array ini akan mewakili data pengguna (user).
      const fetchDataUser = querySnapshot.docs.map((doc) => ({
        ...doc.data()
      }))
      console.log(fetchDataUser);
      return setDataUser(fetchDataUser)
    }
    fetchUser()
  }, [])

  // Ini adalah pernyataan kondisional yang memeriksa apakah tidak ada nilai yang disimpan di dalam localStorage 
  // dengan kunci ('LOGGED_IN'). Ini digunakan untuk mengecek apakah pengguna sudah masuk atau belum.
  // Jika ekspresi ini bernilai true, berarti tidak ada nilai yang tersimpan dengan kunci 'LOGGED_IN' di dalam localStorage, 
  // yang mengindikasikan bahwa pengguna belum masuk. Jadi user akan diarahkan kembali ke halaman login
  // jika mencoba untuk mengakses halaman dashboard tanpa login

  if (!localStorage.getItem('LOGGED_IN')) {
    return <Navigate to="/auth/login" />
  }

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
              dataUser={dataUser}
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