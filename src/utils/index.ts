const isCSR = () => {
    const params = new URLSearchParams(location.search)
    return params.get('csr') ? true : false
}

export {
    isCSR
}