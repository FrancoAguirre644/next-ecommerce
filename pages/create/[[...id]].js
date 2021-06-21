import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../store/GlobalState'
import { getData, postData, putData } from '../../utils/fetchData'
import {ImageUpload} from '../../utils/ImageUpload'
import { useRouter } from 'next/router'

const ProductsManager = () => {

    const initialState = {
        title: '',
        price: 0,
        inStock: 0,
        description: '',
        content: '',
        category: ''
    }

    const [product, setProduct] = useState(initialState)

    const { title, price, inStock, description, content, category } = product

    const [images, setImages] = useState([])

    const { state, dispatch } = useContext(DataContext)

    const { categories, auth } = state

    const router = useRouter()
    const { id } = router.query
    const [onEdit, setOnEdit] = useState(false)
 
    useEffect(() => {

        if(id) {
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                setProduct(res.product)
                setImages(res.product.images)
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
        }

    }, [id])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleUploadInput = e => {
        dispatch({ type: 'NOTIFY', payload: {} })

        let newImages = [];
        let num = 0;
        let err = '';

        const files = [...e.target.files]

        if (files.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Files does not exist.' } })

        files.forEach(file => {
            if (file.size > 1024 * 1024) return err = 'The largest image size is 1mb.'

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') return err = 'Image format is incorrect.'

            num += 1;

            if (num <= 5) newImages.push(file)

            return newImages;

        })

        if (err) dispatch({ type: 'NOTIFY', payload: { error: err } })

        const imgCount = images.length

        if (imgCount + newImages.length > 5)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Select up to 5 images.' } })

        setImages([...images, ...newImages])

    }

    const deleteImage = index => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(auth.user.role !== 'admin')
        return dispatch({type: 'NOTIFY', payload: {error: 'Authentication is not valid.'}})

        if (!title || !price || !inStock || !description || !content || !category === 'all' || images.length === 0)
        return dispatch({type: 'NOTIFY', payload: {error: 'Please add all fields.'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
        let media = []
        const imgNewURL = images.filter(img => !img.url)
        const imgOldURL = images.filter(img => img.url)

        if(imgNewURL.length > 0) media = await ImageUpload(imgNewURL)

        let res;

        if(onEdit) {
            res = await putData(`product/${id}`, {...product, images: [...imgOldURL, ...media]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        } else {
            res = await postData('product', {...product, images: [...imgOldURL, ...media]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

    }

    return (
        <div className="products_manager">
            <Head>
                <title>Products Manager</title>
            </Head>

            <form className="row my-3" onSubmit={handleSubmit}>

                <div className="col-md-6">

                    <input type="text" name="title" value={title}
                        placeholder="Title" className="form-control w-100 p-2 my-2"
                        onChange={handleChangeInput} />

                    <div className="row">
                        <div className="col-md-6">
                            <input type="number" name="price" value={price}
                                placeholder="Price" className="form-control w-100 p-2 my-2"
                                onChange={handleChangeInput} />
                        </div>

                        <div className="col-md-6">
                            <input type="number" name="inStock" value={inStock}
                                placeholder="In Stock" className="form-control w-100 p-2 my-2"
                                onChange={handleChangeInput} />
                        </div>
                    </div>

                    <textarea className="form-control p-2 my-3" name="description" id="description" cols="30" rows="3"
                        placeholder="Description" value={description} onChange={handleChangeInput}
                    />

                    <textarea className="form-control p-2 my-3" name="content" id="content" cols="30" rows="5"
                        placeholder="Content" value={content} onChange={handleChangeInput}
                    />

                    <div className="input-group-prepend px-0 my-3">
                        <select name="category" id="category" value={category}
                            onChange={handleChangeInput} className="custom-select text-capitalize">
                            <option value="all">All products</option>
                            {
                                categories.map(category => (
                                    <option value={category.name} key={category._id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>

                </div>

                <div className="col-md-6">
                    <div className="input-group mb-3 mt-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file border rounded">
                            <input type="file" className="custom-file-input"
                                onChange={handleUploadInput} multiple accept="image/*" />
                        </div>
                    </div>

                    <div className="row img-up">
                        {
                            images.map((image, index) => (
                                <div key={index} className="file_img">
                                    <img src={image.url ? image.url : URL.createObjectURL(image)}
                                        alt="" className="img-thumbnail rounded" />

                                    <span onClick={() => deleteImage(index)}>X</span>
                                </div>
                            ))
                        }

                    </div>
                </div>

                <input type="submit" className="btn btn-info px-4 mx-3" value={onEdit? 'Update' : 'Create'}/>

            </form>

        </div>
    )
}

export default ProductsManager