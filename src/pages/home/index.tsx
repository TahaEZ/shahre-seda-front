// module
import { FC } from 'react'
// custom
import useStore from '../../store'

const Home: FC = () => {
    const onLogout = useStore((store) => store.onLogout)
    console.log(onLogout)

    return <button onClick={onLogout}>Logout</button>
}

export default Home
