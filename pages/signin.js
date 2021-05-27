import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import {useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import Cookie from 'js-cookie'

export const Signin = () => {

    const initialState = { email: '', password: ''}
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData

    const {state, dispatch} = useContext(DataContext)

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]: value})
    }

    const handleSubmit = async e => {
        e.preventDefault();
        dispatch({ type: 'NOTIFY', payload: {loading: true}})

        const res = await postData('auth/login', userData)

        if(res.err) return dispatch({ type:'NOTIFY', payload: {error: res.err}})
        dispatch({ type:'NOTIFY', payload: {success: res.msg}})

        dispatch({ type:'AUTH', payload: {
            token: res.access_token,
            user: res.user
        }})

        Cookie.set('refreshToken', res.refresh_token, {
            path: 'api/auth/accessToken',
            expires: 7
        })

        localStorage.setItem('firstLogin', true)

    }

    return (
        <>
            <Head>
                <title>Sign in</title>
            </Head>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form className=" my-4" style={{maxWidth: '500px'}} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" className="form-control" name="email" value={email} onChange={handleChangeInput}></input>
                            <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={password} onChange={handleChangeInput} className="form-control"></input>
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Login</button>
                        <p className="my-2">
                            You don't have an account? 
                            <Link href="/register">
                                <a style={{color: 'crimson'}}> Register</a>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signin;