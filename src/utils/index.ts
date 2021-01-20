const isCSR = () => {
    if(typeof window === 'undefined') return false
    const params = new URLSearchParams(location.search)
    return params.get('csr') ? true : false
}

export {
    isCSR
}