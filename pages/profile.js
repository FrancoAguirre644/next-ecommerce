import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import valid from '../utils/valid'
import { patchData } from '../utils/fetchData'

const Profile = () => {

    const initialState = {
        avatar: '',
        name: '',
        password: '',
        cf_password: ''
    }

    const [data, setData] = useState(initialState)
    const { avatar, name, password, cf_password } = data

    const { state, dispatch } = useContext(DataContext)
    const { auth, notify } = state

    useEffect(() => {
        if (auth.user) setData({ ...data, name: auth.user.name })
    }, [auth.user])

    const handleChange = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        dispatch({ type: notify, payload: {} })
    }

    const handleUpdateProfile = e => {
        e.preventDefault();

        if (password) {
            const errMsg = valid(name, auth.user.email, password, cf_password)
            if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })

            updatePassword()
        }
    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData('user/resetPassword', { password }, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.msg } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    if (!auth.user) return null;

    return (
        <div className="profile_page">

            <Head>
                <title>Profile</title>
            </Head>

            <div className="row my-3">

                <div className="col-md-4">
                    <h3 className="text-center text-uppercase">
                        {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
                    </h3>

                    <div className="avatar">
                        <img height="150" src={auth.user.avatar} alt={auth.user.avatar} />
                        <span>
                            <i className="fas fa-camera"></i>
                            <p>Change</p>
                            <input type="file" name="file" id="file_up" />
                        </span>
                    </div>

                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" value={name} name="name" placeholder="Your name" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" disabled={true} defaultValue={auth.user.email} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" value={password} name="password" placeholder="Your new password" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" value={cf_password} name="cf_password" placeholder="Confirm your new password" onChange={handleChange} />
                    </div>

                    <button className="btn btn-info" onClick={(e) => handleUpdateProfile(e)}>Update</button>

                </div>

                <div className="col-md-8">
                    <h3>Orders</h3>
                </div>

            </div>

        </div>
    )
}

export default Profile