const toQueryDateString = (date?: Date | string) => {
    if (!date) return

    return new Date(date).toISOString().replace('Z', '')
}

export default toQueryDateString
