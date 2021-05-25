import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import valid from '../utils/valid'
import {useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import {postData} from '../utils/fetchData'


export const Register = () => {

    const initialState = { name: '', email: '', password: '', cf_password: ''}
    const [userData, setUserData] = useState(initialState)
    const { name, email, password, cf_password } = userData

    const [state, dispatch] = useContext(DataContext)

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]: value})
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const errorMsg = valid(name, email, password, cf_password);

        if(errorMsg) {
            return dispatch({ type: 'NOTIFY', payload: {error: errorMsg}})
        } 
            
        dispatch({ type: 'NOTIFY', payload: {loading: true}})

        const res = await postData('auth/register', userData)

        if(res.err) return dispatch({ type:'NOTIFY', payload: {error: res.err}})

        console.log(res)
    }

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form className=" my-4" style={{maxWidth: '500px'}} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Name</label>
                            <input type="text" name="name" value={name} onChange={handleChangeInput} className="form-control"></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="text" className="form-control" name="email" value={email} onChange={handleChangeInput}></input>
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" name="password" value={password} onChange={handleChangeInput}></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Confirm Password</label>
                            <input type="password" className="form-control" name="cf_password" value={cf_password} onChange={handleChangeInput}></input>
                        </div>

                        <button type="submit" className="btn btn-dark w-100">Login</button>
                        <p className="my-2">
                            Already have an account?  
                            <Link href="/signin">
                                <a style={{color: 'crimson'}}> Login</a>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;