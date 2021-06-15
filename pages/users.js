import { DataContext, DataProvider } from '../store/GlobalState'
import { useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const Users = () => {

    const { state, dispatch } = useContext(DataContext)
    const { users, auth } = state

    if(!auth.user) return null;
    return (
        <div className="table-responsive mt-3">
            <Head>
                <title>Users</title>
            </Head>

            <table className="table w-100">
                <thead className="text-uppercase font-weight-bold">
                    <tr>
                        <td></td>
                        <td>ID</td>
                        <td>Avatar</td>
                        <td>Name</td>
                        <td>Email</td>
                        <td>Admin</td>
                        <td>Action</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user._id}</td>
                                <td>
                                    <img src={user.avatar} alt={user.avatar}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        overflow: 'hidden',
                                        objectFit: 'cover'
                                    }}
                                    />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {
                                        user.role === 'admin'
                                        ? <i className="fas fa-check text-success"></i>
                                        : <i className="fas fa-times text-danger"></i>
                                    }
                                </td>
                                <td>
                                    <Link href={
                                        auth.user.root && auth.user.email !== user.email
                                        ? `/edit_user/${user._id}` : `#!`
                                    }>
                                        <a><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                    </Link>
                                    
                                    {
                                        auth.user.root && auth.user.email !== user.email
                                        ? <i className="fas fa-trash-alt text-danger ml-2" title="Remove"
                                            data-toggle="modal" data-target="#exampleModal" style={{cursor: 'pointer'}}
                                            onClick={() => dispatch({
                                                type: 'ADD_MODAL',
                                                payload: {data: users, id: user._id, title: user.name, type: 'ADD_USERS'}
                                            })}></i>
                                        : <i className="fas fa-trash-alt text-danger ml-2" title="Remove"></i>
                                    }

                                </td>
                            </tr>
                        ))
                    }
                </tbody>

            </table>

        </div>
    )
}

export default Users