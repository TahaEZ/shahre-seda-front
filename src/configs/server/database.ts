type DatabaseApi = {
    backup: () => string
    restore: () => string
}

const databaseApis: DatabaseApi = {
    backup: () => '/database/backup',
    restore: () => '/database/restore',
}

export default databaseApis
