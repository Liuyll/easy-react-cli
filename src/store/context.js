import React, { createContext, useReducer, useCallback } from 'react'
import { getState, reducer, getAction } from './state' 

const store = getState()
const Context = createContext({ value: 'default' })
const Provider = (props) => {
    const { children } = props
    const [state, _commit] = useReducer(reducer, store)

    const commit = useCallback((key, payload) => {
        _commit({
            key,
            payload
        })
    }, [_commit])

    const dispatch = useCallback(async (key, payload) => {
        const target = getAction(key)
        target({
            commit,
            payload
        })
    })
    return (
        <Context.Provider value={{ store: state, dispatch, commit }}>
            {children}
        </Context.Provider>
    )
}

export {
    Provider,
    Context
}