import * as React from 'react'
import { isCSR } from '../utils'

const Home = () => {
    return (
        <div className="wrap">
            Welcome to Easy-React{isCSR() ? '' : '-SSR'}
            <div className="content">
                <img src='./test.jpg' />
            </div>
        </div>
    )
}

export default Home