// custom
import Api from '../../enums/api'

const apiUri: Record<Api, (...args: any) => string> = {
    login: () => 'login'
}

export default apiUri
