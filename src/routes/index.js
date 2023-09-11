import Profile from "../pages/user/Profile"

const coreRoutes = [
    {
        path:'/profile',
        title:'Profile User',
        component:Profile
    }
]

const routes = [...coreRoutes]
export default routes