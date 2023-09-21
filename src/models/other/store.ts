// custom
import { ThemeMode } from '../../enums/theme'
import User from '../entities/user'

interface DataOfStore {
    themeMode: ThemeMode
    isSidebarOpen: boolean
    token: string | null
    user: User | null
}

interface ActionsOfStore {
    setThemeMode: (themeMode: DataOfStore['themeMode']) => void
    setSidebarStatus: (isSidebarOpen: DataOfStore['isSidebarOpen']) => void
    setToken: (token: DataOfStore['token']) => void
    setUser: (user: DataOfStore['user']) => void
    onLogin: (token: DataOfStore['token'], user: DataOfStore['user']) => void
    onLogout: () => void
}

type Store = DataOfStore & ActionsOfStore

export default Store
