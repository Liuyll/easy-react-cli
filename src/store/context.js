import React, { createContext, useReducer, useCallback } from 'react'
import { reducer, getAction, getInitState } from './state' 

const Context = createContext({ value: 'default' })
const Provider = (props) => {
    let { children, store } = props
    if(!store) store = getInitState()
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