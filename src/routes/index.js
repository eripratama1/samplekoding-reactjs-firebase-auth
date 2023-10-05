import AccountSetting from "../pages/user/AccountSetting"
import Profile from "../pages/user/Profile"

const coreRoutes = [
    {
        path:'/profile',
        title:'Profile User',
        component:Profile
    },
    {
        path:'/account-setting',
        title:'Account Setting',
        component:AccountSetting
    }
]

const routes = [...coreRoutes]
export default routes