// custom
type OperatorsApi = {
    getOperators: () => string
    createOperators: () => string
    getOperatorById: (id: string) => string
    updateOperatorById: (id: string) => string
    deleteOperators: (id: string) => string
}

const operatorsApis: OperatorsApi = {
    getOperators: () => '/operators',
    createOperators: () => '/operators',
    getOperatorById: (id: string) => `/operators/${id}`,
    updateOperatorById: (id: string) => `/operators/${id}`,
    deleteOperators: (id: string) => `/operators/${id}`,
}

export default operatorsApis
