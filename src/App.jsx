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
        <Route element={<DefaultLayout />}>
          <Route index element={<Dashboard />} />
          {routes.map(({ path, component: Component }) => (
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
