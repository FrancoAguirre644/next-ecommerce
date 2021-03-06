import Head from 'next/head'
import { useContext, useState } from 'react'
import { updateItem } from '../store/Actions'
import { DataContext } from '../store/GlobalState'
import { postData, putData } from '../utils/fetchData'

const Categories = () => {

    const [name, setName] = useState('')

    const { state, dispatch } = useContext(DataContext)

    const { categories, auth } = state

    const [id, setId] = useState('')

    const createCategory = async () => {

        if(auth.user.role !== 'admin') return dispatch({type: 'NOTIFY', payload: {error: 'Authentication is not valid.'}})

        if(!name) return dispatch({type: 'NOTIFY', payload: {error: 'Name is required.'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        let res;

        if(id) {
            res = await putData(`category/${id}`, { name }, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
            dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'))

        } else {
            res = await postData('category', { name }, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
            dispatch({type: "ADD_CATEGORIES", payload: [...categories, res.newCategory]})
        }

        setId('')
        setName('')
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

    const handleEditCategory = async (category) => {
        setId(category._id)
        setName(category.name)
        console.log(category)
    }   

    return (
        <div className="col-md-6 mx-auto my-3">
            <Head>
                <title>Categories</title>
            </Head>

            <div class="card-header shadow bg-white d-flex align-items-center justify-content-between border-bottom-pink">

                <input type="text" className="form-control"
                    placeholder="Add new Category" value={name}
                    onChange={(e) => setName(e.target.value)} />

                <button className="btn btn-secondary ml-2" onClick={createCategory}>{id ? "Update" : "Create"}</button>

            </div>

            {
                categories.map(category => (
                    <div key={category._id} className="card text-capitalize">
                        <div className="card-body d-flex justify-content-between">
                            {category.name}

                            <div style={{cursor: 'pointer'}}>
                                <i className="fas fa-edit mr-2 text-info"
                                onClick={() => handleEditCategory(category)}></i>

                                <i className="fas fa-trash-alt mr-2 text-danger"
                                data-toggle="modal" data-target="#exampleModal"
                                onClick={() => dispatch({
                                    type: 'ADD_MODAL',
                                    payload: [{data: categories, id: category._id, title: category.name, type: 'ADD_CATEGORIES'}]
                                })}></i>
                            </div>

                        </div>

                        <hr/>
                    
                    </div>
                ))
            }

        </div>
    )
}

export default Categories