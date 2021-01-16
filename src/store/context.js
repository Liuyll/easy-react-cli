import React, { createContext } from 'react'

const Context = createContext({ a: 1 })
const Provider = (props) => {
    const { store, children } = props
    return (
        <Context.Provider value={store}>
            {children}
        </Context.Provider>
    )
}

export {
    Provider,
    Context
}