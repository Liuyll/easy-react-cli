import * as React from 'react'
import { useEffect } from 'react'
import src from '../../public/test.jpg'

const Home = () => {
    useEffect(() => {
        console.log(123)
    }, [])
    return (
        <div className="wrap">
            Welcome to Easy-React
            <div className="content">
                <img src={src} />
            </div>
        </div>
    )
}

export default Home