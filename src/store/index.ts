// module
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// custom
import Store from '../models/other/store'
import { ThemeMode } from '../enums/theme'

const useStore = create(
    persist<Store>(
        (set) => ({
            themeMode: ThemeMode.DARK,
            token: null,
            user: null,
            isSidebarOpen: true,
            setThemeMode: (themeMode) => {
                set((state) => ({ ...state, themeMode }))
            },
            setToken: (token: Store['token']) => {
                set({ token })
            },
            setUser: (user: Store['user']) => {
                set({ user })
            },
            setSidebarStatus: () => {
                set({})
            },
            onLogin: (token: Store['token'], user: Store['user']) => {
                set({ token, user })
            },
            onLogout: () => {
                set({ token: null, user: null })
            }
        }),
        {
            name: 'ShahreSedaStore'
        }
    )
)

export default useStore
