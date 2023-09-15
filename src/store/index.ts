// module
import { create } from 'zustand'
// custom
import Store from '../models/other/store'
import { ThemeMode } from '../enums/theme'

const useStore = create<Store>((set) => ({
    themeMode: ThemeMode.DARK,
    token: null,
    user: null,
    isSidebarOpen: true,
    actions: {
        setThemeMode: (themeMode) => {
            set((state) => ({ ...state, themeMode }))
        },
        setToken: (token: Store['token']) => {
            set({ token });
        },
        setUser: (user: Store['user']) => {
            set({ user });
        },
        setSidebarStatus: () => {
            set({})
        },
        onLogin: (token: Store['token'], user: Store['user']) => {
            set({ token, user })
        },
        onLogout: () => {
            set({ token: null, user: null })
        },
    },
}))

export default useStore
