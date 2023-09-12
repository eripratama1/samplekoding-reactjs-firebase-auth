import { Suspense, useEffect, useState } from 'react'
import DefaultLayout from './layout/DefaultLayout';
import Login from './pages/auth/Login';
import routes from './routes';
import { Route, Routes } from 'react-router-dom';
import Loader from './common/Loader';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Index';

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, [])


  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* <Route element={<DefaultLayout />}>: 
        Ini adalah elemen utama dalam pengaturan routing. 
        Ini menentukan layout default (biasanya digunakan untuk tampilan umum dalam aplikasi Anda) yang akan digunakan di seluruh 
        rute yang didefinisikan di dalamnya. Artinya, semua rute yang tercantum di dalam elemen ini akan menggunakan <DefaultLayout /> sebagai layout-nya. */}
        <Route element={<DefaultLayout />}>

          {/* <Route index element={<Dashboard />} /> adalah rute yang disebut "rute indeks." 
        Ini adalah rute yang akan diaktifkan ketika URL sesuai dengan rute akar (root) dari aplikasi Anda. 
        Ketika itu terjadi, komponen <Dashboard /> akan dirender dalam layout default (<DefaultLayout />). */}
          <Route index element={<Dashboard />} />

          {/* {routes.map(({ path, component: Component }) => ( ... ))} 
          Ini adalah bagian yang memetakan berbagai rute yang telah kita definisikan dalam file routes 
          untuk menjadi elemen-elemen<Route>. 
          Menggunakan map()untuk membuat elemen-elemen<Route>` berdasarkan definisi rute yang ada. */}
          {routes.map(({ path, component: Component }) => (


          // <Route path={path} key={path} element={ ... } />: Di dalam loop map(),
          // adalah elemen-elemen rute individu yang dibuat berdasarkan definisi rute dalam file routes.
          // Setiap elemen rute memiliki properti path yang sesuai dengan path yang didefinisikan dalam routes, dan
          // elemen element yang berisi komponen yang akan dirender saat rute ini diakses.
          // Pada contoh ini, komponen di-bungkus dalam <Suspense> yang memberikan loading fallback dengan komponen <Loader />.
          // Ini memungkinkan Kita untuk menggantikan komponen yang akan dirender dengan tampilan loading 
          // sementara komponen tersebut diambil dari server atau dikodekan secara dinamis.
            <Route
              path={path}
              key={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </>
  )


}

export default App
