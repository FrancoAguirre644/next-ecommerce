import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import valid from '../utils/valid'
import { patchData } from '../utils/fetchData'
import {ImageUpload} from '../utils/ImageUpload'
import Link from 'next/link'

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
    const { auth, notify, orders } = state

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

        if (name !== auth.user.name || avatar) updateInfo()

    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData('user/resetPassword', { password }, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.msg } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        if (!file)
            return dispatch({ type: 'NOTIFY', payload: { error: 'File does not exist.' } })

        if (file.size > 1024 * 1024) // 1mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'The largest image size is 1mb.' } })

        if (file.type !== "image/jpeg" && file.type !== "image/png")
            return dispatch({ type: 'NOTIFY', payload: { error: 'Image format is incorrect.' } })

        setData({ ...data, avatar: file })
    }

    const updateInfo = async () => {
        let media;
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        if (avatar) media = await ImageUpload([avatar])

        patchData('user', {
            name, avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token).then(res => {

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

            dispatch({
                type: 'AUTH', payload: {
                    token: auth.token,
                    user: res.user
                }
            })

            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

        })

        console.log(media)
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
                        <img height="150" src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt={avatar} />
                        <span>
                            <i className="fas fa-camera"></i>
                            <p>Change</p>
                            <input type="file" name="file" id="file_up"
                                accept="image/*" onChange={changeAvatar} />
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

                <div className="col-md-8 table-responsive">
                    <h3 className="text-uppercase">Orders</h3>
                    <div className="my-3">
                        <table className="table-bordered table-hover w-100 text-uppercase"
                        style={{minWidth: '600px'}}>

                            <thead className="bg-light font-weight-bold">
                                <tr>
                                    <td className="p-2">id</td>
                                    <td className="p-2">date</td>
                                    <td className="p-2">total</td>
                                    <td className="p-2">delivered</td>
                                    <td className="p-2">action</td>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    orders.map((order, index) => (
                                        <tr key={index}>
                                            <td className="p-2">{order._id}</td>
                                            <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-2">${order.total}</td>
                                            <td className="p-2">
                                                {
                                                    order.delivered
                                                    ? <i className="fas fa-check text-success"></i>
                                                    : <i className="fas fa-times text-danger"></i>
                                                }
                                            </td>
                                            <td className="p-2">
                                                <Link href={`/order/${order._id}`}>
                                                    <a>details</a>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Profile