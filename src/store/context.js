import React, { createContext, useReducer, useCallback } from 'react'
import { state as store, reducer, getAction } from './store' 

const Context = createContext({ value: 'default' })
const Provider = (props) => {
    const { children } = props
    const [state, _commit] = useReducer(reducer, store)

    const commit = useCallback((key, payload) => {
        _commit({
            key,
            payload
        })
    }, [state])

    const dispatch = useCallback(async (key, payload) => {
        const target = getAction(key)
        target({
            commit,
            payload
        })
    })
    return (
        <Context.Provider value={{ store, dispatch, commit }}>
            {children}
        </Context.Provider>
    )
}

export {
    Provider,
    Context
}