import * as React from 'react'

export default () => {
    let option_chaining_test = {
        a: 1,
        b: 2
    }
    return (
        <div>{option_chaining_test?.c?.d ?? 'no d'}</div>
    )
}