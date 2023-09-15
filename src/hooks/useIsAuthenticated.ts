// custom
import Store from '../models/other/store'
import useStore from '../store'

const useIsAuthenticated = (): boolean => {
    const token: Store['token'] = useStore<Store['token']>(
        (store: Store) => store.token
    )
    const user: Store['user'] = useStore<Store['user']>(
        (store: Store) => store.user
    )

    return token !== null && user !== null
}

export default useIsAuthenticated
