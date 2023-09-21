// module
import { FC } from 'react'
// custom
import useStore from '../../store'

const Login: FC = () => {
    const onLogin = useStore((store) => store.onLogin)

    return (
        <button onClick={() => onLogin('sdasd', { name: 'sdad' })}>
            Login
        </button>
    )
}

export default Login
