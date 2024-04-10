// custom
type CutsApi = {
    getCuts: () => string
    getCutById: (id: string) => string
    createCut: () => string
    updateCut: (cutId: string) => string
    deleteCut: (cutId: string) => string
}

const cutsApis: CutsApi = {
    getCuts: () => '/cuts',
    getCutById: (id) => `/cuts/${id}`,
    createCut: () => '/cuts',
    updateCut: (cutId) => `/cuts/${cutId}`,
    deleteCut: (cutId) => `/cuts/${cutId}`,
}

export default cutsApis
